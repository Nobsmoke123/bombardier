import { Injectable, NotFoundException } from '@nestjs/common';
import type { SettingsPublic } from '@job-tracker/types';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly users: UsersService) {}

  async get(userId: string): Promise<SettingsPublic> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { dailyTarget: user.dailyTarget };
  }

  async update(userId: string, dailyTarget: number): Promise<SettingsPublic> {
    const user = await this.users.updateDailyTarget(userId, dailyTarget);
    return { dailyTarget: user.dailyTarget };
  }
}
