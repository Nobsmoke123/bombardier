import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { ImportsService } from '../imports.service.js';
import {
  CSV_IMPORT_QUEUE,
  type CsvImportJobData,
} from '../queue/imports.queue.js';

@Processor(CSV_IMPORT_QUEUE)
export class CsvImportProcessor extends WorkerHost {
  constructor(private readonly imports: ImportsService) {
    super();
  }

  process(job: Job<CsvImportJobData>): Promise<void> {
    return this.imports.processJob(job.data);
  }
}
