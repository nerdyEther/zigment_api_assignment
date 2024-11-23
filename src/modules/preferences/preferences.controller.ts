import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
    UseFilters,
    UseInterceptors,
    UseGuards
  } from '@nestjs/common';
  import { PreferencesService } from './preferences.service';
  import { CreatePreferenceDto } from './dto/create-preference.dto';
  import { UserPreference } from './schemas/user-preference.schema';
  import { GlobalExceptionFilter } from '../../common/filters/global-exception.filter';
  import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
  import { ApiKeyGuard } from '../../common/guards/api-key.guard';
  import { CustomThrottlerGuard } from '../../common/guards/throttler.guard';
  import { Throttle } from '@nestjs/throttler';
  @Controller('api/preferences')
  @UseFilters(GlobalExceptionFilter)
  @UseInterceptors(LoggingInterceptor)
  export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Throttle({ default: { limit: 10, ttl: 60000 } }) 
    @UseGuards(ApiKeyGuard, CustomThrottlerGuard) 
    async createPreference(
      @Body() createPreferenceDto: CreatePreferenceDto
    ): Promise<UserPreference> {
      return this.preferencesService.createPreference(createPreferenceDto);
    }
  
    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) 
    @UseGuards(ApiKeyGuard, CustomThrottlerGuard) 
    async getUserPreference(
      @Param('userId') userId: string
    ): Promise<UserPreference> {
      return this.preferencesService.getUserPreference(userId);
    }
  
    @Patch(':userId')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    @Throttle({ default: { limit: 10, ttl: 60000 } }) 
    @UseGuards(ApiKeyGuard, CustomThrottlerGuard) 
    async updatePreference(
      @Param('userId') userId: string,
      @Body() updatePreferenceDto: Partial<CreatePreferenceDto>
    ): Promise<UserPreference> {
      return this.preferencesService.updatePreference(userId, updatePreferenceDto);
    }
  
    @Delete(':userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) 
    @UseGuards(ApiKeyGuard, CustomThrottlerGuard) 
    async deletePreference(
      @Param('userId') userId: string
    ): Promise<void> {
      await this.preferencesService.deletePreference(userId);
    }
  
 
         
  }

