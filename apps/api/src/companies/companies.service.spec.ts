import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompaniesService } from './companies.service.js';

describe('CompaniesService', () => {
  let service: CompaniesService;
  const userId = '11111111-1111-1111-1111-111111111111';
  const companyId = '44444444-4444-4444-4444-444444444444';

  const application = {
    id: '55555555-5555-5555-5555-555555555555',
    companyId,
    resumeId: null,
    role: '',
    coverLetter: null,
    linkedinMessage: null,
    applied: false,
    linkedinOutreach: false,
    connectionCount: 0,
    applicationDate: null,
    status: ApplicationStatus.NOT_APPLIED,
    resume: null,
  };

  const company = {
    id: companyId,
    userId,
    name: 'Acme',
    normalizedName: 'acme',
    website: 'https://acme.com',
    industry: 'Software',
    createdAt: new Date('2026-01-04T00:00:00.000Z'),
    application,
  };

  const prisma = {
    company: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
    application: {
      createMany: vi.fn(),
      update: vi.fn(),
    },
    resume: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    prisma.company.findMany.mockResolvedValue([]);
    prisma.application.createMany.mockResolvedValue({ count: 0 });
    prisma.$transaction.mockImplementation(async (ops: Promise<unknown>[]) =>
      Promise.all(ops),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CompaniesService);
  });

  it('lists companies with pagination', async () => {
    prisma.company.count.mockResolvedValue(1);
    prisma.company.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([company]);

    const result = await service.findAll(userId, {
      page: 1,
      pageSize: 20,
    });

    expect(result.total).toBe(1);
    expect(result.items[0]?.name).toBe('Acme');
    expect(result.items[0]?.application.status).toBe('NOT_APPLIED');
  });

  it('updates application fields and marks applied when status changes', async () => {
    prisma.company.findFirst.mockResolvedValue(company);
    prisma.application.update.mockResolvedValue({
      ...application,
      status: ApplicationStatus.APPLIED,
      applied: true,
      role: 'Backend engineer',
    });

    await service.update(userId, companyId, {
      role: 'Backend engineer',
      status: ApplicationStatus.APPLIED,
    });

    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: application.id },
      data: expect.objectContaining({
        role: 'Backend engineer',
        status: ApplicationStatus.APPLIED,
        applied: true,
      }),
    });
  });

  it('rejects a resume that does not belong to the user', async () => {
    prisma.company.findFirst.mockResolvedValue(company);
    prisma.resume.findFirst.mockResolvedValue(null);

    await expect(
      service.update(userId, companyId, {
        resumeId: '66666666-6666-6666-6666-666666666666',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('404s when the company is missing', async () => {
    prisma.company.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, companyId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
