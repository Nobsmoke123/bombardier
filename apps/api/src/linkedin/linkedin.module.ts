import { Module } from '@nestjs/common';
import { LinkedInController } from './linkedin.controller.js';
import { LinkedInService } from './linkedin.service.js';

@Module({
  controllers: [LinkedInController],
  providers: [LinkedInService],
})
export class LinkedInModule {}
