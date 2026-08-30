import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ApplicationPublic,
  CompanyPublic,
  DashboardStats,
  TodayQueueResponse,
} from '@job-tracker/types';
import {
  ApplicationStatus,
  ConnectionStatus,
  type Application,
  type Company,
  type Resume,
} from '@prisma/client';
import { ensureDefaultApplications } from '../companies/ensure-applications.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { rate, utcDayRange } from './dashboard.math.js';

const INTERVIEW_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.HR_STAGE,
  ApplicationStatus.TECHNICAL,
  ApplicationStatus.FINAL_INTERVIEW,
  ApplicationStatus.ACCEPTED,
];

type CompanyWithApplication = Company & {
  application:
    | (Application & {
        resume: Pick<Resume, 'id' | 'title'> | null;
      })
    | null;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async stats(userId: string): Promise<DashboardStats> {
    await ensureDefaultApplications(this.prisma, userId);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { start, end } = utcDayRange();
    const [
      totalCompanies,
      totalResumes,
      applications,
      contacts,
      appliedToday,
    ] = await Promise.all([
      this.prisma.company.count({ where: { userId } }),
      this.prisma.resume.count({ where: { userId } }),
      this.prisma.application.findMany({
        where: { company: { userId } },
        include: { resume: { select: { id: true, title: true } } },
      }),
      this.prisma.linkedInContact.findMany({
        where: { application: { company: { userId } } },
        select: { status: true },
      }),
      this.prisma.application.count({
        where: {
          company: { userId },
          applicationDate: { gte: start, lt: end },
        },
      }),
    ]);

    const statusBreakdown = emptyBreakdown();
    const resumeStats = new Map<
      string,
      { title: string; applied: number; interviews: number; offers: number }
    >();

    let applied = 0;
    let notApplied = 0;
    let rejected = 0;
    let interviews = 0;
    let offers = 0;
    let outreachApps = 0;

    for (const application of applications) {
      statusBreakdown[application.status] += 1;
      if (application.status === ApplicationStatus.NOT_APPLIED) {
        notApplied += 1;
      } else {
        applied += 1;
      }
      if (application.status === ApplicationStatus.REJECTED) {
        rejected += 1;
      }
      if (INTERVIEW_STATUSES.includes(application.status)) {
        interviews += 1;
      }
      if (application.status === ApplicationStatus.ACCEPTED) {
        offers += 1;
      }
      if (application.linkedinOutreach) {
        outreachApps += 1;
      }
      if (application.resumeId && application.resume) {
        const current = resumeStats.get(application.resumeId) ?? {
          title: application.resume.title,
          applied: 0,
          interviews: 0,
          offers: 0,
        };
        if (application.status !== ApplicationStatus.NOT_APPLIED) {
          current.applied += 1;
        }
        if (INTERVIEW_STATUSES.includes(application.status)) {
          current.interviews += 1;
        }
        if (application.status === ApplicationStatus.ACCEPTED) {
          current.offers += 1;
        }
        resumeStats.set(application.resumeId, current);
      }
    }

    const successfulContacts = contacts.filter(
      (contact) =>
        contact.status === ConnectionStatus.ACCEPTED ||
        contact.status === ConnectionStatus.CONVERSING,
    ).length;

    return {
      totalCompanies,
      applied,
      notApplied,
      totalResumes,
      rejectionRate: rate(rejected, applied),
      interviewRate: rate(interviews, applied),
      offerRate: rate(offers, applied),
      linkedinSuccessRate: rate(successfulContacts, contacts.length),
      totalLinkedinOutreach: Math.max(outreachApps, contacts.length),
      dailyTarget: user.dailyTarget,
      todaysRemaining: Math.max(0, user.dailyTarget - appliedToday),
      appliedToday,
      statusBreakdown,
      resumePerformance: [...resumeStats.entries()].map(([resumeId, value]) => ({
        resumeId,
        ...value,
      })),
    };
  }

  async today(userId: string): Promise<TodayQueueResponse> {
    await ensureDefaultApplications(this.prisma, userId);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { start, end } = utcDayRange();
    const appliedToday = await this.prisma.application.count({
      where: {
        company: { userId },
        applicationDate: { gte: start, lt: end },
      },
    });
    const remaining = Math.max(0, user.dailyTarget - appliedToday);

    const companies = remaining
      ? await this.prisma.company.findMany({
          where: {
            userId,
            application: { status: ApplicationStatus.NOT_APPLIED },
          },
          include: {
            application: {
              include: { resume: { select: { id: true, title: true } } },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: remaining,
        })
      : [];

    return {
      items: companies.map((company) => toPublic(company)),
      dailyTarget: user.dailyTarget,
      appliedToday,
      remaining,
    };
  }
}

function emptyBreakdown(): Record<ApplicationStatus, number> {
  return {
    NOT_APPLIED: 0,
    APPLIED: 0,
    HR_STAGE: 0,
    TECHNICAL: 0,
    FINAL_INTERVIEW: 0,
    ACCEPTED: 0,
    REJECTED: 0,
  };
}

function toPublic(company: CompanyWithApplication): CompanyPublic {
  const application = company.application!;
  return {
    id: company.id,
    name: company.name,
    website: company.website,
    industry: company.industry,
    createdAt: company.createdAt.toISOString(),
    application: toApplicationPublic(application),
  };
}

function toApplicationPublic(
  application: Application & {
    resume: Pick<Resume, 'id' | 'title'> | null;
  },
): ApplicationPublic {
  return {
    id: application.id,
    role: application.role,
    resumeId: application.resumeId,
    resumeTitle: application.resume?.title ?? null,
    coverLetter: application.coverLetter,
    linkedinMessage: application.linkedinMessage,
    applied: application.applied,
    linkedinOutreach: application.linkedinOutreach,
    connectionCount: application.connectionCount,
    applicationDate: application.applicationDate?.toISOString() ?? null,
    status: application.status,
  };
}
