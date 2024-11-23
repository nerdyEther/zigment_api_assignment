import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from './schemas/user-preference.schema';
import { CreatePreferenceDto } from './dto/create-preference.dto';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

  constructor(
    @InjectModel(UserPreference.name)
    private userPreferenceModel: Model<UserPreference>,
  ) {}

  private validateEmail(email: string): void {
    if (!email || !EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Invalid email address');
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('User ID is required and cannot be empty');
    }
  }

  private validatePreferences(preferences: any): void {
    try {
      const requiredFields = [
        'marketing',
        'newsletter',
        'updates',
        'frequency',
        'channels',
      ];

      if (
        !preferences ||
        requiredFields.some((field) => !(field in preferences))
      ) {
        throw new Error('Invalid preferences structure');
      }

      const validFrequencies = ['daily', 'weekly', 'monthly'];
      if (!validFrequencies.includes(preferences.frequency)) {
        throw new Error('Invalid notification frequency');
      }

      const validChannels = ['email', 'sms', 'push'];
      if (
        !preferences.channels ||
        !validChannels.every(
          (channel) => typeof preferences.channels[channel] === 'boolean',
        )
      ) {
        throw new Error('Invalid notification channels');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createPreference(
    createPreferenceDto: CreatePreferenceDto,
  ): Promise<UserPreference> {
    try {
      // validating input
      this.validateUserId(createPreferenceDto.userId);
      this.validateEmail(createPreferenceDto.email);
      this.validatePreferences(createPreferenceDto.preferences);

      // C if user preference already exists
      const existingPreference = await this.userPreferenceModel.findOne({
        userId: createPreferenceDto.userId,
      });

      if (existingPreference) {
        throw new ConflictException('User preferences already exist');
      }

      // create and  return new preference
      const newPreference =
        await this.userPreferenceModel.create(createPreferenceDto);
      this.logger.log(
        `Created preferences for user ${createPreferenceDto.userId}`,
      );
      return newPreference;
    } catch (error) {
      this.logger.error(
        `Failed to create preference: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserPreference(userId: string): Promise<UserPreference> {
    try {
      this.validateUserId(userId);

      const preference = await this.userPreferenceModel.findOne({ userId });
      if (!preference) {
        throw new NotFoundException('User preferences not found');
      }
      return preference;
    } catch (error) {
      this.logger.error(
        `Failed to get user preference: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updatePreference(
    userId: string,
    updatePreferenceDto: Partial<CreatePreferenceDto>,
  ): Promise<UserPreference> {
    try {
      this.validateUserId(userId);

      // validating  specific fields if provided
      if (updatePreferenceDto.email) {
        this.validateEmail(updatePreferenceDto.email);
      }

      if (updatePreferenceDto.preferences) {
        this.validatePreferences(updatePreferenceDto.preferences);
      }

      const updatedPreference = await this.userPreferenceModel.findOneAndUpdate(
        { userId },
        updatePreferenceDto,
        {
          new: true,
          runValidators: true,
          upsert: false, 
        },
      );

      if (!updatedPreference) {
        throw new NotFoundException('User preferences not found');
      }

      this.logger.log(`Updated preferences for user ${userId}`);
      return updatedPreference;
    } catch (error) {
      this.logger.error(
        `Failed to update preference: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deletePreference(userId: string): Promise<void> {
    try {
      this.validateUserId(userId);

      const result = await this.userPreferenceModel.deleteOne({ userId });

      if (result.deletedCount === 0) {
        throw new NotFoundException('User preferences not found');
      }

      this.logger.log(`Deleted preferences for user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete preference: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
