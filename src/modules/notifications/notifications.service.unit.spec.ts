import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from '../preferences/schemas/user-preference.schema';
import { NotificationLog } from './schemas/notification-log.schema';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockUserPreferenceModel: any;
  let mockNotificationLogModel: any;

  const mockUserPreference = {
    userId: 'user123',
    preferences: {
      channels: {
        email: true,
        sms: false,
        push: true,
      },
      marketing: true,
      newsletter: false,
      updates: true,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(UserPreference.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUserPreference),
          },
        },
        {
          provide: getModelToken(NotificationLog.name),
          useValue: {
            create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            findOne: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    mockUserPreferenceModel = module.get(getModelToken(UserPreference.name));
    mockNotificationLogModel = module.get(getModelToken(NotificationLog.name));
  });

  describe('sendNotification', () => {
    const validNotificationDto: SendNotificationDto = {
      userId: 'user123',
      type: 'marketing',
      channel: 'email',
      content: {
        subject: 'Test Subject',
        body: 'Test Body',
      },
    };

    it('should successfully send a notification', async () => {
      const result = await service.sendNotification(validNotificationDto);

      expect(result).toMatchObject({
        userId: 'user123',
        type: 'marketing',
        channel: 'email',
        status: 'sent',
      });
    });

    it('should throw NotFoundException if user preferences not found', async () => {
      mockUserPreferenceModel.findOne.mockResolvedValue(null);

      await expect(
        service.sendNotification(validNotificationDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for disabled channel', async () => {
      const smsNotificationDto: SendNotificationDto = {
        ...validNotificationDto,
        channel: 'sms',
      };

      await expect(
        service.sendNotification(smsNotificationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for disabled notification type', async () => {
      const newsletterNotificationDto: SendNotificationDto = {
        ...validNotificationDto,
        type: 'newsletter',
      };

      await expect(
        service.sendNotification(newsletterNotificationDto),
      ).rejects.toThrow(BadRequestException);
    });

    describe('Invalid Input Validation', () => {
      it('should throw BadRequestException for empty userId', async () => {
        const invalidDto: SendNotificationDto = {
          userId: '',
          type: 'marketing',
          channel: 'email',
          content: {
            subject: 'Test',
            body: 'Test Body',
          },
        };

        await expect(service.sendNotification(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException for invalid notification type', async () => {
        const invalidDto: any = {
          userId: 'user123',
          type: 'invalid_type',
          channel: 'email',
          content: {
            subject: 'Test',
            body: 'Test Body',
          },
        };

        await expect(service.sendNotification(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException for invalid channel', async () => {
        const invalidDto: any = {
          userId: 'user123',
          type: 'marketing',
          channel: 'carrier_pigeon',
          content: {
            subject: 'Test',
            body: 'Test Body',
          },
        };

        await expect(service.sendNotification(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('Comprehensive Error Scenarios', () => {
      it('should throw specific error for disabled marketing notifications', async () => {
        const mockUserPreference = {
          userId: 'user123',
          preferences: {
            channels: { email: true },
            marketing: false,
            newsletter: false,
            updates: true,
          },
        };

        mockUserPreferenceModel.findOne.mockResolvedValue(mockUserPreference);

        const marketingDto: SendNotificationDto = {
          userId: 'user123',
          type: 'marketing',
          channel: 'email',
          content: {
            subject: 'Disabled Marketing',
            body: 'Test Body',
          },
        };

        await expect(service.sendNotification(marketingDto)).rejects.toThrow(
          'Notification not allowed by user preferences',
        );
      });
    });
  });

  describe('getUserNotificationLogs', () => {
    it('should retrieve notification logs without filters', async () => {
      const mockLogs = [
        { userId: 'user123', type: 'marketing', channel: 'email' },
        { userId: 'user123', type: 'updates', channel: 'push' },
      ];

      mockNotificationLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockLogs),
        }),
      });

      const result = await service.getUserNotificationLogs('user123');
      expect(result).toEqual(mockLogs);
    });

    it('should retrieve notification logs with filters', async () => {
      const mockLogs = [
        { userId: 'user123', type: 'marketing', channel: 'email' },
      ];

      mockNotificationLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockLogs),
        }),
      });

      const result = await service.getUserNotificationLogs('user123', {
        type: 'marketing',
        channel: 'email',
      });
      expect(result).toEqual(mockLogs);
    });

    it('should retrieve notification logs with status filter', async () => {
      const mockLogs = [
        {
          userId: 'user123',
          type: 'marketing',
          channel: 'email',
          status: 'sent',
        },
      ];

      mockNotificationLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockLogs),
        }),
      });

      const result = await service.getUserNotificationLogs('user123', {
        status: 'sent',
      });

      expect(result).toEqual(mockLogs);
      expect(mockNotificationLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          status: 'sent',
        }),
      );
    });

    it('should retrieve notification logs with multiple filters', async () => {
      const mockLogs = [
        {
          userId: 'user123',
          type: 'marketing',
          channel: 'email',
          status: 'sent',
        },
      ];

      mockNotificationLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockLogs),
        }),
      });

      const result = await service.getUserNotificationLogs('user123', {
        type: 'marketing',
        channel: 'email',
        status: 'sent',
      });

      expect(result).toEqual(mockLogs);
      expect(mockNotificationLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          type: 'marketing',
          channel: 'email',
          status: 'sent',
        }),
      );
    });

    it('should handle multiple simultaneous filter conditions in logs', async () => {
      const complexFilters: {
        type?: 'marketing' | 'updates' | 'newsletter';
        channel?: 'email' | 'sms' | 'push';
        status?: 'sent' | 'failed' | 'pending';
      } = {
        type: 'marketing',
        channel: 'email',
        status: 'sent',
      };

      const mockLogs = [
        {
          userId: 'user123',
          type: 'marketing',
          channel: 'email',
          status: 'sent',
        },
      ];

      mockNotificationLogModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockLogs),
        }),
      });

      const result = await service.getUserNotificationLogs(
        'user123',
        complexFilters,
      );

      expect(result).toBeDefined();
      result.forEach((log) => {
        expect(log.userId).toBe('user123');
        expect(log.type).toBe('marketing');
        expect(log.channel).toBe('email');
        expect(log.status).toBe('sent');
      });
    });
  });

  describe('getNotificationStats', () => {
    it('should retrieve notification stats for a user', async () => {
      const userId = 'user123';

      mockNotificationLogModel.countDocuments.mockResolvedValue(10);
      mockNotificationLogModel.aggregate
        .mockImplementationOnce(() =>
          Promise.resolve([
            { _id: 'sent', count: 7 },
            { _id: 'failed', count: 3 },
          ]),
        )
        .mockImplementationOnce(() =>
          Promise.resolve([
            { _id: 'marketing', count: 5 },
            { _id: 'updates', count: 5 },
          ]),
        );

      const result = await service.getNotificationStats(userId);

      expect(result).toEqual({
        totalNotifications: 10,
        statusStats: {
          sent: 7,
          failed: 3,
        },
        typeStats: {
          marketing: 5,
          updates: 5,
        },
      });
    });
  });

  describe('getGlobalNotificationStats', () => {
    it('should retrieve global notification stats', async () => {
      mockNotificationLogModel.countDocuments.mockResolvedValue(50);
      mockNotificationLogModel.aggregate
        .mockImplementationOnce(() =>
          Promise.resolve([
            { _id: 'sent', count: 40 },
            { _id: 'failed', count: 10 },
          ]),
        )
        .mockImplementationOnce(() =>
          Promise.resolve([
            { _id: 'marketing', count: 25 },
            { _id: 'updates', count: 25 },
          ]),
        );

      const result = await service.getGlobalNotificationStats();

      expect(result).toEqual({
        totalNotifications: 50,
        statusStats: {
          sent: 40,
          failed: 10,
        },
        typeStats: {
          marketing: 25,
          updates: 25,
        },
      });
    });
  });

  describe('convertAggregateToObject', () => {
    it('should convert aggregate result to object', () => {
      const aggregateResult = [
        { _id: 'sent', count: 5 },
        { _id: 'failed', count: 2 },
      ];

      const privateMethod = (service as any).convertAggregateToObject;
      const result = privateMethod(aggregateResult);

      expect(result).toEqual({
        sent: 5,
        failed: 2,
      });
    });
  });
});
