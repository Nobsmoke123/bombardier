import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatus, ConnectionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { DashboardService } from './dashboard.service.js';

describe('DashboardService', () => {
  let service: DashboardService;
  const userId = '11111111-1111-1111-1111-111111111111';

  const prisma = {
    company: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    resume: { count: vi.fn(), findMany: vi.fn() },
    csvImport: { findMany: vi.fn() },
    application: {
      findMany: vi.fn(),
      count: vi.fn(),
      createMany: vi.fn(),
    },
    linkedInContact: { findMany: vi.fn() },
  };
  const users = {
    findById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    prisma.company.findMany.mockResolvedValue([]);
    prisma.resume.findMany.mockResolvedValue([]);
    prisma.csvImport.findMany.mockResolvedValue([]);
    prisma.application.createMany.mockResolvedValue({ count: 0 });
    users.findById.mockResolvedValue({
      id: userId,
      dailyTarget: 20,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: users },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  it('aggregates rates and remaining target', async () => {
    prisma.company.count.mockResolvedValue(4);
    prisma.resume.count.mockResolvedValue(2);
    prisma.application.count.mockResolvedValue(3);
    prisma.application.findMany.mockResolvedValue([
      {
        status: ApplicationStatus.NOT_APPLIED,
        linkedinOutreach: false,
        resumeId: null,
        resume: null,
      },
      {
        status: ApplicationStatus.APPLIED,
        linkedinOutreach: true,
        resumeId: 'r1',
        resume: { id: 'r1', title: 'Backend' },
      },
      {
        status: ApplicationStatus.TECHNICAL,
        linkedinOutreach: true,
        resumeId: 'r1',
        resume: { id: 'r1', title: 'Backend' },
      },
      {
        status: ApplicationStatus.REJECTED,
        linkedinOutreach: false,
        resumeId: 'r2',
        resume: { id: 'r2', title: 'Frontend' },
      },
    ]);
    prisma.linkedInContact.findMany.mockResolvedValue([
      { status: ConnectionStatus.PENDING },
      { status: ConnectionStatus.ACCEPTED },
    ]);

    const stats = await service.stats(userId);

    expect(stats.totalCompanies).toBe(4);
    expect(stats.applied).toBe(3);
    expect(stats.notApplied).toBe(1);
    expect(stats.rejectionRate).toBe(0.3333);
    expect(stats.interviewRate).toBe(0.3333);
    expect(stats.offerRate).toBe(0);
    expect(stats.linkedinSuccessRate).toBe(0.5);
    expect(stats.totalLinkedinOutreach).toBe(2);
    expect(stats.dailyTarget).toBe(20);
    expect(stats.todaysRemaining).toBe(17);
    expect(stats.resumePerformance[0]?.applied).toBe(2);
    expect(stats.timeline).toHaveLength(14);
    expect(stats.recentActivity).toEqual([]);
  });

  it('builds recent activity from applications, resumes, and imports', async () => {
    prisma.company.count.mockResolvedValue(1);
    prisma.resume.count.mockResolvedValue(1);
    prisma.application.count.mockResolvedValue(1);
    prisma.application.findMany.mockResolvedValue([
      {
        id: 'a1',
        status: ApplicationStatus.APPLIED,
        linkedinOutreach: false,
        resumeId: null,
        resume: null,
        applicationDate: new Date('2026-08-30T09:00:00.000Z'),
        company: { id: 'c1', name: 'Acme' },
      },
    ]);
    prisma.linkedInContact.findMany.mockResolvedValue([]);
    prisma.resume.findMany.mockResolvedValue([
      {
        id: 'r1',
        title: 'Backend',
        createdAt: new Date('2026-08-29T12:00:00.000Z'),
      },
    ]);
    prisma.csvImport.findMany.mockResolvedValue([
      {
        id: 'i1',
        filename: 'companies.csv',
        createdAt: new Date('2026-08-28T12:00:00.000Z'),
      },
    ]);

    const stats = await service.stats(userId);

    expect(stats.recentActivity.map((item) => item.id)).toEqual([
      'application-a1',
      'resume-r1',
      'import-i1',
    ]);
    expect(stats.recentActivity[0]).toMatchObject({
      type: 'application',
      label: 'Applied to Acme',
      href: '/companies/c1',
    });
  });

  it('does not treat dated unapplied companies as activity', async () => {
    prisma.company.count.mockResolvedValue(1);
    prisma.resume.count.mockResolvedValue(0);
    prisma.application.count.mockResolvedValue(0);
    prisma.application.findMany.mockResolvedValue([
      {
        id: 'a1',
        status: ApplicationStatus.NOT_APPLIED,
        linkedinOutreach: false,
        resumeId: null,
        resume: null,
        applicationDate: new Date('2026-08-30T09:00:00.000Z'),
        company: { id: 'c1', name: 'Acme' },
      },
    ]);
    prisma.linkedInContact.findMany.mockResolvedValue([]);

    const stats = await service.stats(userId);

    expect(stats.recentActivity).toEqual([]);
    expect(stats.applied).toBe(0);
  });

  it('returns only remaining unapplied companies for today', async () => {
    prisma.application.count.mockResolvedValue(18);
    prisma.company.findMany.mockResolvedValue([
      {
        id: 'c1',
        userId,
        name: 'Acme',
        normalizedName: 'acme',
        website: null,
        industry: null,
        createdAt: new Date('2026-01-01'),
        application: {
          id: 'a1',
          companyId: 'c1',
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
        },
      },
    ]);

    const queue = await service.today(userId);

    expect(queue.remaining).toBe(2);
    expect(queue.items).toHaveLength(1);
    expect(prisma.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 2 }),
    );
  });
});
