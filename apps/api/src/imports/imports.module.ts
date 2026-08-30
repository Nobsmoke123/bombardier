import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module.js';
import { CsvService } from './csv.service.js';
import { ImportsController } from './imports.controller.js';
import { ImportsService } from './imports.service.js';
import { CsvImportProcessor } from './processor/csv-import.processor.js';
import { CSV_IMPORT_QUEUE } from './queue/imports.queue.js';

@Module({
  imports: [
    StorageModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST') ?? 'localhost',
          port: Number(config.get<string>('REDIS_PORT') ?? 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: CSV_IMPORT_QUEUE,
    }),
  ],
  controllers: [ImportsController],
  providers: [CsvService, ImportsService, CsvImportProcessor],
  exports: [ImportsService],
})
export class ImportsModule {}
