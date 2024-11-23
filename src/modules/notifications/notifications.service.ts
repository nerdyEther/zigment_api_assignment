import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from '../preferences/schemas/user-preference.schema';
import { NotificationLog } from './schemas/notification-log.schema';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(UserPreference.name)
    private userPreferenceModel: Model<UserPreference>,
    @InjectModel(NotificationLog.name)
    private notificationLogModel: Model<NotificationLog>,
  ) {}

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
  ): Promise<NotificationLog> {
    try {
      const { userId, type, channel, content } = sendNotificationDto;

      // validate input
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('User ID cannot be empty');
      }

      const sanitizedContent = {
        subject: this.sanitizeContent(content.subject, 200),
        body: this.sanitizeContent(content.body, 2000),
      };

      const userPreference = await this.findUserPreference(userId);
      this.validateNotificationSettings(userPreference, type, channel);
      return this.createNotificationLog(
        userId,
        type,
        channel,
        sanitizedContent,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private sanitizeContent(content: string, maxLength: number): string {
    return content ? content.trim().substring(0, maxLength) : '';
  }

  private async findUserPreference(userId: string): Promise<UserPreference> {
    const userPreference = await this.userPreferenceModel.findOne({ userId });
    if (!userPreference) {
      throw new NotFoundException('User preferences not found');
    }
    return userPreference;
  }

  private validateNotificationSettings(
    userPreference: UserPreference,
    type: string,
    channel: string,
  ): void {
    const isChannelEnabled = userPreference.preferences?.channels?.[channel];
    const isTypeEnabled = userPreference.preferences?.[type];

    if (!isChannelEnabled || !isTypeEnabled) {
      throw new BadRequestException(
        'Notification not allowed by user preferences',
      );
    }
  }

  private async createNotificationLog(
    userId: string,
    type: string,
    channel: string,
    content: { subject: string; body: string },
  ): Promise<NotificationLog> {
    return this.notificationLogModel.create({
      userId,
      type,
      channel,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        content: {
          subject: content.subject,
          body: content.body,
        },
      },
    });
  }
  async getUserNotificationLogs(
    userId: string,
    filters?: {
      type?: 'marketing' | 'newsletter' | 'updates';
      channel?: 'email' | 'sms' | 'push';
      status?: 'pending' | 'sent' | 'failed';
    },
  ): Promise<NotificationLog[]> {
    const query: any = { userId };

    if (filters) {
      if (filters.type) query.type = filters.type;
      if (filters.channel) query.channel = filters.channel;
      if (filters.status) query.status = filters.status;
    }

    return this.notificationLogModel
      .find(query)
      .sort({ sentAt: -1 }) // sort by most recent first
      .limit(100); // limit to prevent overwhelming response
  }

  async getNotificationStats(userId: string): Promise<any> {
    const totalNotifications = await this.notificationLogModel.countDocuments({
      userId,
    });

    const statusStats = await this.notificationLogModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await this.notificationLogModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalNotifications,
      statusStats: this.convertAggregateToObject(statusStats),
      typeStats: this.convertAggregateToObject(typeStats),
    };
  }

  async getGlobalNotificationStats(): Promise<{
    totalNotifications: number;
    statusStats: Record<string, number>;
    typeStats: Record<string, number>;
  }> {
    const totalNotifications = await this.notificationLogModel.countDocuments();

    const statusStats = await this.notificationLogModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await this.notificationLogModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalNotifications,
      statusStats: this.convertAggregateToObject(statusStats),
      typeStats: this.convertAggregateToObject(typeStats),
    };
  }

  private convertAggregateToObject(
    aggregateResult: any[],
  ): Record<string, number> {
    return aggregateResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }
}
