import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserPreference } from './schemas/user-preference.schema';

describe('Preferences Integration Tests', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let preferenceModel: Model<UserPreference>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    mongoConnection = (await mongoose.connect(uri)).connection;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    preferenceModel = app.get(getModelToken(UserPreference.name));
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
    await app.close();
  });

  afterEach(async () => {
    if (preferenceModel) {
      await preferenceModel.deleteMany({});
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  const apiKeyHeader = { 'X-API-KEY': 'qwerty' };
  const createPreferencePayload = {
    userId: 'user123',
    email: 'test@example.com',
    preferences: {
      marketing: true,
      newsletter: true,
      updates: false,
      frequency: 'weekly',
      channels: {
        email: true,
        sms: false,
        push: true,
      },
    },
    timezone: 'Asia/Kolkata',
  };

  // Basic CRUD operations tests
  describe('Basic Operations', () => {
    describe('POST /api/preferences', () => {
      it('should create a preference successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/preferences')
          .set(apiKeyHeader)
          .send(createPreferencePayload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.userId).toBe(createPreferencePayload.userId);

        // solving race condition
        await new Promise((resolve) => setTimeout(resolve, 100));

        const savedPreference = await preferenceModel
          .findOne({
            userId: createPreferencePayload.userId,
          })
          .exec();
        expect(savedPreference).toBeDefined();
        expect(savedPreference.email).toBe(createPreferencePayload.email);
      });

      it('should fail with invalid API key', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/preferences')
          .set('X-API-KEY', 'invalid-key')
          .send(createPreferencePayload);

        expect(response.status).toBe(401);
      });

      it('should fail with invalid payload', async () => {
        const invalidPayload = {
          ...createPreferencePayload,
          email: 'invalid-email',
        };

        const response = await request(app.getHttpServer())
          .post('/api/preferences')
          .set(apiKeyHeader)
          .send(invalidPayload);

        expect(response.status).toBe(400);
      });
    });

    describe('GET /api/preferences/:userId', () => {
      it('should retrieve user preference by userId', async () => {
        await preferenceModel.create(createPreferencePayload);

        const response = await request(app.getHttpServer())
          .get(`/api/preferences/${createPreferencePayload.userId}`)
          .set(apiKeyHeader);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          'userId',
          createPreferencePayload.userId,
        );
      });

      it('should return 404 if user preference does not exist', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/preferences/nonexistent-user')
          .set(apiKeyHeader);

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE /api/preferences/:userId', () => {
      it('should delete a preference successfully', async () => {
        await preferenceModel.create(createPreferencePayload);

        const response = await request(app.getHttpServer())
          .delete(`/api/preferences/${createPreferencePayload.userId}`)
          .set(apiKeyHeader);

        expect(response.status).toBe(204);

        const deletedPreference = await preferenceModel
          .findOne({
            userId: createPreferencePayload.userId,
          })
          .exec();
        expect(deletedPreference).toBeNull();
      });

      it('should return 404 if preference does not exist', async () => {
        const response = await request(app.getHttpServer())
          .delete('/api/preferences/nonexistent-user')
          .set(apiKeyHeader);

        expect(response.status).toBe(404);
      });
    });
  });

  // cases seprated to avoid rate limiting issue
  describe('Edge Cases', () => {
    describe('Validation Tests', () => {
      it('should fail if `userId` is missing', async () => {
        const { userId, ...invalidPayload } = createPreferencePayload;

        const response = await request(app.getHttpServer())
          .post('/api/preferences')
          .set(apiKeyHeader)
          .send(invalidPayload);

        expect(response.status).toBe(400);
      });

      it('should fail if `channels` has invalid structure', async () => {
        const invalidPayload = {
          ...createPreferencePayload,
          preferences: {
            ...createPreferencePayload.preferences,
            channels: { email: true, invalidKey: true },
          },
        };

        const response = await request(app.getHttpServer())
          .post('/api/preferences')
          .set(apiKeyHeader)
          .send(invalidPayload);

        expect(response.status).toBe(400);
      });
    });
  });

  // rate limiting tests
  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/api/preferences')
          .set(apiKeyHeader)
          .send({
            ...createPreferencePayload,
            userId: `user${i}`,
          });
      }

      const response = await request(app.getHttpServer())
        .post('/api/preferences')
        .set(apiKeyHeader)
        .send(createPreferencePayload);

      expect(response.status).toBe(429); // too many req error
    });
  });
});
