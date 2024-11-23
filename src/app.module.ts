import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {
  NotificationLog,
  NotificationLogSchema,
} from './modules/notifications/schemas/notification-log.schema';
import { NotificationsService } from './modules/notifications/notifications.service';
import { NotificationsController } from './modules/notifications/notifications.controller';
import {
  UserPreference,
  UserPreferenceSchema,
} from './modules/preferences/schemas/user-preference.schema';
import { PreferencesService } from './modules/preferences/preferences.service';
import { PreferencesController } from './modules/preferences/preferences.controller';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL', 60), //per 60 seconds
          limit: config.get('THROTTLE_LIMIT', 10), //10 requests
        },
      ],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        retryAttempts: 3,
        connectionErrorFactory: (error) => {
          console.error('MongoDB Connection Error:', error);
          throw error;
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
  ],

  providers: [
    NotificationsService,
    PreferencesService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],

  controllers: [NotificationsController, PreferencesController],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.verifyDatabaseConnection();
  }

  private verifyDatabaseConnection() {
    try {
      if (this.connection.readyState === 1) {
        console.log('Mongodb_connected');
      } else {
        console.warn('mongodb_notconnected');
      }
    } catch (error) {
      console.error('mongodb_failed', error);
    }
  }
}
