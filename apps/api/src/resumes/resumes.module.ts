import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module.js';
import { ResumesController } from './resumes.controller.js';
import { ResumesService } from './resumes.service.js';

@Module({
  imports: [StorageModule],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
