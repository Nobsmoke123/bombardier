import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';

@Module({
  imports: [UsersModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
