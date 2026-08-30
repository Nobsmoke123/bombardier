import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { CsvImportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import { CsvService } from './csv.service.js';
import { ImportsService } from './imports.service.js';
import { CSV_IMPORT_QUEUE } from './queue/imports.queue.js';

describe('ImportsService', () => {
  let service: ImportsService;
  const userId = '11111111-1111-1111-1111-111111111111';
  const objectKey = `users/${userId}/imports/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.csv`;

  const prisma = {
    csvImport: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    company: {
      createMany: vi.fn(),
      findMany: vi.fn(),
    },
    application: {
      createMany: vi.fn(),
    },
  };
  const storage = {
    getObjectBuffer: vi.fn(),
  };
  const csv = {
    parseCompanies: vi.fn(),
  };
  const queue = {
    add: vi.fn(),
  };

  const record = {
    id: '33333333-3333-3333-3333-333333333333',
    userId,
    filename: 'companies.csv',
    objectKey,
    totalRows: 0,
    uniqueRows: 0,
    duplicatesRemoved: 0,
    status: CsvImportStatus.PENDING,
    error: null,
    createdAt: new Date('2026-01-03T00:00:00.000Z'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportsService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
        { provide: CsvService, useValue: csv },
        { provide: getQueueToken(CSV_IMPORT_QUEUE), useValue: queue },
      ],
    }).compile();

    service = module.get(ImportsService);
  });

  it('creates an import record and enqueues a BullMQ job', async () => {
    prisma.csvImport.create.mockResolvedValue(record);
    queue.add.mockResolvedValue({ id: 'job-1' });

    const result = await service.enqueue(userId, {
      filename: 'companies.csv',
      objectKey,
    });

    expect(result.status).toBe('PENDING');
    expect(queue.add).toHaveBeenCalledWith(
      'process',
      { importId: record.id, userId },
      expect.any(Object),
    );
  });

  it('downloads, parses, inserts with skipDuplicates, and stores stats', async () => {
    prisma.csvImport.findFirst.mockResolvedValue(record);
    storage.getObjectBuffer.mockResolvedValue(Buffer.from('name\nAcme'));
    csv.parseCompanies.mockResolvedValue({
      rows: [
        {
          name: 'Acme',
          normalizedName: 'acme',
          website: null,
          industry: null,
        },
      ],
      totalRows: 2,
      uniqueRows: 1,
      duplicatesRemoved: 1,
    });
    prisma.company.createMany.mockResolvedValue({ count: 1 });
    prisma.company.findMany.mockResolvedValue([{ id: '44444444-4444-4444-4444-444444444444' }]);
    prisma.application.createMany.mockResolvedValue({ count: 1 });
    prisma.csvImport.update.mockResolvedValue(record);

    await service.processJob({ importId: record.id, userId });

    expect(prisma.company.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId,
          name: 'Acme',
          normalizedName: 'acme',
          website: null,
          industry: null,
        },
      ],
      skipDuplicates: true,
    });
    expect(prisma.csvImport.update).toHaveBeenCalledWith({
      where: { id: record.id },
      data: {
        totalRows: 2,
        uniqueRows: 1,
        duplicatesRemoved: 1,
        status: CsvImportStatus.COMPLETED,
        error: null,
      },
    });
  });
});
