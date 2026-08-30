import { Controller, Get, UseGuards } from '@nestjs/common';
import type {
  DashboardStats,
  TodayQueueResponse,
  UserPublic,
} from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('stats')
  stats(@CurrentUser() user: UserPublic): Promise<DashboardStats> {
    return this.dashboard.stats(user.id);
  }

  @Get('today')
  today(@CurrentUser() user: UserPublic): Promise<TodayQueueResponse> {
    return this.dashboard.today(user.id);
  }
}
