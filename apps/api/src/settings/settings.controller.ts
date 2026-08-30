import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import type { SettingsPublic, UserPublic } from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';
import { SettingsService } from './settings.service.js';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(@CurrentUser() user: UserPublic): Promise<SettingsPublic> {
    return this.settings.get(user.id);
  }

  @Patch()
  update(
    @CurrentUser() user: UserPublic,
    @Body() dto: UpdateSettingsDto,
  ): Promise<SettingsPublic> {
    return this.settings.update(user.id, dto.dailyTarget);
  }
}
