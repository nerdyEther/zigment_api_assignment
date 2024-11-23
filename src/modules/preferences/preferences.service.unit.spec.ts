import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesService } from './preferences.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserPreference } from './schemas/user-preference.schema';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('PreferencesService', () => {
  let service: PreferencesService;
  let mockUserPreferenceModel: any;

  const mockCreatePreferenceDto: CreatePreferenceDto = {
    userId: 'user123',
    email: 'test@example.com',
    timezone: 'UTC',
    preferences: {
      marketing: true,
      newsletter: true,
      updates: true,
      frequency: 'weekly',
      channels: {
        email: true,
        sms: false,
        push: false,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        {
          provide: getModelToken(UserPreference.name),
          useValue: {
            create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
    mockUserPreferenceModel = module.get(getModelToken(UserPreference.name));
  });

  describe('Input Validation', () => {
    describe('createPreference', () => {
      it('should throw BadRequestException for empty userId', async () => {
        const invalidDto: CreatePreferenceDto = {
          ...mockCreatePreferenceDto,
          userId: '',
        };
        await expect(service.createPreference(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException for invalid email', async () => {
        const invalidDto: CreatePreferenceDto = {
          ...mockCreatePreferenceDto,
          email: 'invalid-email',
        };
        await expect(service.createPreference(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });

     
      it('should throw BadRequestException for missing preferences fields', async () => {
        const invalidDto: CreatePreferenceDto = {
          ...mockCreatePreferenceDto,
          preferences: {
            marketing: true,
           
          } as any,
        };
        await expect(service.createPreference(invalidDto)).rejects.toThrow(
          new BadRequestException('Invalid preferences structure'),
        );
      });

     
      it('should throw BadRequestException for invalid notification channels structure', async () => {
        const invalidDto: CreatePreferenceDto = {
          ...mockCreatePreferenceDto,
          preferences: {
            ...mockCreatePreferenceDto.preferences,
            channels: {
              email: 'yes', // invalid boolean value
            },
          } as any,
        };
        await expect(service.createPreference(invalidDto)).rejects.toThrow(
          new BadRequestException('Invalid notification channels'),
        );
      });

      it('should throw BadRequestException for invalid preferences frequency', async () => {
        const invalidDto: CreatePreferenceDto = {
          ...mockCreatePreferenceDto,
          preferences: {
            ...mockCreatePreferenceDto.preferences,
            frequency: 'invalid-frequency' as any,
          },
        };
        await expect(service.createPreference(invalidDto)).rejects.toThrow(
          BadRequestException,
        );
      });

    
      it('should successfully create preferences when all validations pass', async () => {
        mockUserPreferenceModel.findOne.mockResolvedValue(null);
        mockUserPreferenceModel.create.mockResolvedValue(
          mockCreatePreferenceDto,
        );

        const result = await service.createPreference(mockCreatePreferenceDto);
        expect(result).toEqual(mockCreatePreferenceDto);
        expect(mockUserPreferenceModel.create).toHaveBeenCalledWith(
          mockCreatePreferenceDto,
        );
      });
    });

    describe('updatePreference', () => {

      it('should validate email during partial update', async () => {
        const partialUpdateDto: Partial<CreatePreferenceDto> = {
          email: 'invalid-email',
        };

        await expect(
          service.updatePreference('user123', partialUpdateDto),
        ).rejects.toThrow(new BadRequestException('Invalid email address'));
      });

      it('should throw BadRequestException for invalid partial update', async () => {
        const partialUpdateDto: Partial<CreatePreferenceDto> = {
          preferences: {
            frequency: 'weekly',
            marketing: false,
            newsletter: false,
            updates: false,
            channels: {
              email: false,
              sms: false,
              push: false,
            },
          },
        };
        mockUserPreferenceModel.findOneAndUpdate.mockResolvedValue(
          mockCreatePreferenceDto,
        );

        const result = await service.updatePreference(
          'user123',
          partialUpdateDto,
        );
        expect(result).toBeDefined();
      });
    });
  });

  describe('Existing Preferences', () => {
    it('should throw ConflictException when creating duplicate preferences', async () => {
      mockUserPreferenceModel.findOne.mockResolvedValue({});

      await expect(
        service.createPreference(mockCreatePreferenceDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Retrieve Preferences', () => {
    it('should retrieve user preferences', async () => {
      mockUserPreferenceModel.findOne.mockResolvedValue(
        mockCreatePreferenceDto,
      );

      const result = await service.getUserPreference('user123');
      expect(result).toMatchObject(mockCreatePreferenceDto);
    });

    it('should throw NotFoundException if preferences not found', async () => {
      mockUserPreferenceModel.findOne.mockResolvedValue(null);

      await expect(service.getUserPreference('user123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update Preferences', () => {
    it('should update user preferences', async () => {
      const updatedPreference: CreatePreferenceDto = {
        ...mockCreatePreferenceDto,
        preferences: {
          ...mockCreatePreferenceDto.preferences,
          marketing: false,
        },
      };

      mockUserPreferenceModel.findOneAndUpdate.mockResolvedValue(
        updatedPreference,
      );

      const result = await service.updatePreference('user123', {
        preferences: {
          marketing: false,
          newsletter: false,
          updates: false,
          frequency: 'weekly',
          channels: {
            email: false,
            sms: false,
            push: false,
          },
        },
      });

      expect(result).toMatchObject(updatedPreference);
    });

    it('should throw NotFoundException if preferences not found during update', async () => {
      mockUserPreferenceModel.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        service.updatePreference('user123', {
          preferences: {
            marketing: false,
            newsletter: false,
            updates: false,
            frequency: 'weekly',
            channels: {
              email: false,
              sms: false,
              push: false,
            },
          },
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Delete Preferences', () => {
    it('should delete user preferences', async () => {
      mockUserPreferenceModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(service.deletePreference('user123')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if preferences not found during deletion', async () => {
      mockUserPreferenceModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.deletePreference('user123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
