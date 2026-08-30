import { Module } from '@nestjs/common';
import { ImportsModule } from '../imports/imports.module.js';
import { CompaniesController } from './companies.controller.js';
import { CompaniesService } from './companies.service.js';

@Module({
  imports: [ImportsModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
