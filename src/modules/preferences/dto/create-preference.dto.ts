import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PreferencesDto {
  @IsNotEmpty()
  marketing: boolean;

  @IsNotEmpty()
  newsletter: boolean;

  @IsNotEmpty()
  updates: boolean;

  @IsEnum(['daily', 'weekly', 'monthly', 'never'])
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';

  @IsObject()
  @ValidateNested()
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export class CreatePreferenceDto {
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto;

  @IsString()
  @IsNotEmpty()
  timezone: string;
}
