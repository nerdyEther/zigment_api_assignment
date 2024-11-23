import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationLog } from './schemas/notification-log.schema';
import { GlobalExceptionFilter } from '../../common/filters/global-exception.filter';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../../common/guards/throttler.guard';
@Controller('api/notifications')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(ApiKeyGuard, CustomThrottlerGuard)
  async sendNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<NotificationLog> {
    return this.notificationsService.sendNotification(sendNotificationDto);
  }

  @Get(':userId/logs')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(ApiKeyGuard, CustomThrottlerGuard)
  async getUserNotificationLogs(
    @Param('userId') userId: string,
    @Query('type') type?: 'marketing' | 'newsletter' | 'updates',
    @Query('channel') channel?: 'email' | 'sms' | 'push',
    @Query('status') status?: 'pending' | 'sent' | 'failed',
  ): Promise<NotificationLog[]> {
    return this.notificationsService.getUserNotificationLogs(userId, {
      type,
      channel,
      status,
    });
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(ApiKeyGuard, CustomThrottlerGuard)
  async getGlobalNotificationStats(): Promise<{
    totalNotifications: number;
    statusStats: Record<string, number>;
    typeStats: Record<string, number>;
  }> {
    return this.notificationsService.getGlobalNotificationStats();
  }
}
