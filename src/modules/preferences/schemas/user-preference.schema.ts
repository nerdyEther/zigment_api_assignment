import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Schema({ _id: false })
class NotificationChannels {
  @Prop({ type: Boolean, default: true })
  email: boolean;

  @Prop({ type: Boolean, default: false })
  sms: boolean;

  @Prop({ type: Boolean, default: false })
  push: boolean;
}

@Schema({ _id: false })
class Preferences {
  @Prop({ type: Boolean, default: true })
  marketing: boolean;

  @Prop({ type: Boolean, default: true })
  newsletter: boolean;

  @Prop({ type: Boolean, default: true })
  updates: boolean;

  @Prop({
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    default: 'weekly',
  })
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';

  @Prop({ type: NotificationChannels })
  @ValidateNested()
  @Type(() => NotificationChannels)
  channels: NotificationChannels;
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
    virtuals: true,
  },
})
export class UserPreference extends Document {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ required: true , unique:true})
  @IsEmail()
  email: string;

  @Prop({ type: Preferences, required: true })
  @ValidateNested()
  @Type(() => Preferences)
  preferences: Preferences;

  @Prop({ required: true })
  timezone: string;
}

export type UserPreferenceDocument = UserPreference & Document;
export const UserPreferenceSchema =
  SchemaFactory.createForClass(UserPreference);
