import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class NotificationLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: String,
    enum: ['marketing', 'newsletter', 'updates'],
    required: true,
  })
  type: 'marketing' | 'newsletter' | 'updates';

  @Prop({
    type: String,
    enum: ['email', 'sms', 'push'],
    required: true,
  })
  channel: 'email' | 'sms' | 'push';

  @Prop({
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'sent' | 'failed';

  @Prop()
  sentAt?: Date;

  @Prop()
  failureReason?: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const NotificationLogSchema =
  SchemaFactory.createForClass(NotificationLog);
