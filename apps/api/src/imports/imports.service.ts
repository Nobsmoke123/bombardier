import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { CsvImportPublic } from '@job-tracker/types';
import { CsvImportStatus, type CsvImport } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { assertImportFileKey } from '../storage/storage.keys.js';
import { StorageService } from '../storage/storage.service.js';
import { CsvService } from './csv.service.js';
import type { CreateImportDto } from './dto/create-import.dto.js';
import {
  CSV_IMPORT_JOB,
  CSV_IMPORT_QUEUE,
  type CsvImportJobData,
} from './queue/imports.queue.js';

@Injectable()
export class ImportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly csv: CsvService,
    @InjectQueue(CSV_IMPORT_QUEUE) private readonly queue: Queue<CsvImportJobData>,
  ) {}

  async enqueue(userId: string, dto: CreateImportDto): Promise<CsvImportPublic> {
    assertImportFileKey(userId, dto.objectKey);

    const record = await this.prisma.csvImport.create({
      data: {
        userId,
        filename: dto.filename.trim(),
        objectKey: dto.objectKey,
      },
    });

    try {
      await this.queue.add(
        CSV_IMPORT_JOB,
        { importId: record.id, userId },
        { removeOnComplete: 50, removeOnFail: 50 },
      );
    } catch {
      await this.prisma.csvImport.update({
        where: { id: record.id },
        data: {
          status: CsvImportStatus.FAILED,
          error: 'Could not enqueue the import job',
        },
      });
      throw new InternalServerErrorException('Could not enqueue the import job');
    }

    return toPublic(record);
  }

  async findAll(userId: string): Promise<CsvImportPublic[]> {
    const imports = await this.prisma.csvImport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return imports.map(toPublic);
  }

  async findOne(userId: string, id: string): Promise<CsvImportPublic> {
    const record = await this.prisma.csvImport.findFirst({
      where: { id, userId },
    });
    if (!record) {
      throw new NotFoundException('Import not found');
    }
    return toPublic(record);
  }

  async processJob(data: CsvImportJobData): Promise<void> {
    const record = await this.prisma.csvImport.findFirst({
      where: { id: data.importId, userId: data.userId },
    });
    if (!record) {
      return;
    }

    try {
      const buffer = await this.storage.getObjectBuffer(
        data.userId,
        record.objectKey,
      );
      const parsed = await this.csv.parseCompanies(buffer);

      await this.prisma.company.createMany({
        data: parsed.rows.map((row) => ({
          userId: data.userId,
          name: row.name,
          normalizedName: row.normalizedName,
          website: row.website,
          industry: row.industry,
        })),
        skipDuplicates: true,
      });

      await this.prisma.csvImport.update({
        where: { id: record.id },
        data: {
          totalRows: parsed.totalRows,
          uniqueRows: parsed.uniqueRows,
          duplicatesRemoved: parsed.duplicatesRemoved,
          status: CsvImportStatus.COMPLETED,
          error: null,
        },
      });
    } catch (error) {
      await this.prisma.csvImport.update({
        where: { id: record.id },
        data: {
          status: CsvImportStatus.FAILED,
          error:
            error instanceof Error ? error.message : 'CSV import failed',
        },
      });
      throw error;
    }
  }
}

function toPublic(record: CsvImport): CsvImportPublic {
  return {
    id: record.id,
    filename: record.filename,
    objectKey: record.objectKey,
    totalRows: record.totalRows,
    uniqueRows: record.uniqueRows,
    duplicatesRemoved: record.duplicatesRemoved,
    status: record.status,
    error: record.error,
    createdAt: record.createdAt.toISOString(),
  };
}
