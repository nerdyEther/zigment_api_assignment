import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendNotificationDto {
  @IsNotEmpty()
  userId: string;

  @IsEnum(['marketing', 'newsletter', 'updates'])
  type: 'marketing' | 'newsletter' | 'updates';

  @IsEnum(['email', 'sms', 'push'])
  channel: 'email' | 'sms' | 'push';

  @IsObject()
  content: {
    subject: string;
    body: string;
  };
}
