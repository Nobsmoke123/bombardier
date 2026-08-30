import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  ApplicationPublic,
  CompanyListResponse,
  CompanyPublic,
} from '@job-tracker/types';
import { ApplicationStatus, type Application, type Company, type Resume } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ListCompaniesDto } from './dto/list-companies.dto.js';
import type { UpdateCompanyDto } from './dto/update-company.dto.js';
import { ensureDefaultApplications } from './ensure-applications.js';

type CompanyWithApplication = Company & {
  application:
    | (Application & {
        resume: Pick<Resume, 'id' | 'title'> | null;
      })
    | null;
};

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    query: ListCompaniesDto,
  ): Promise<CompanyListResponse> {
    await ensureDefaultApplications(this.prisma, userId);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const search = query.search?.trim();
    const where = {
      userId,
      ...(search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {}),
      ...(query.status ? { application: { status: query.status } } : {}),
    };

    const [total, companies] = await this.prisma.$transaction([
      this.prisma.company.count({ where }),
      this.prisma.company.findMany({
        where,
        include: {
          application: { include: { resume: { select: { id: true, title: true } } } },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: companies.map((company) => toPublic(company)),
      page,
      pageSize,
      total,
    };
  }

  async findOne(userId: string, id: string): Promise<CompanyPublic> {
    await ensureDefaultApplications(this.prisma, userId);
    return toPublic(await this.requireOwned(userId, id));
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyPublic> {
    await ensureDefaultApplications(this.prisma, userId);
    const company = await this.requireOwned(userId, id);

    if (dto.resumeId) {
      const resume = await this.prisma.resume.findFirst({
        where: { id: dto.resumeId, userId },
      });
      if (!resume) {
        throw new BadRequestException('Resume not found');
      }
    }

    const nextStatus = dto.status ?? company.application!.status;
    const applied = nextStatus !== ApplicationStatus.NOT_APPLIED;
    let applicationDate =
      dto.applicationDate === undefined
        ? company.application!.applicationDate
        : dto.applicationDate
          ? new Date(dto.applicationDate)
          : null;

    if (
      applied &&
      !applicationDate &&
      dto.status &&
      dto.status !== ApplicationStatus.NOT_APPLIED
    ) {
      applicationDate = new Date();
    }

    await this.prisma.application.update({
      where: { id: company.application!.id },
      data: {
        ...(dto.role !== undefined ? { role: dto.role.trim() } : {}),
        ...(dto.resumeId !== undefined ? { resumeId: dto.resumeId } : {}),
        ...(dto.coverLetter !== undefined ? { coverLetter: dto.coverLetter } : {}),
        ...(dto.linkedinMessage !== undefined
          ? { linkedinMessage: dto.linkedinMessage }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.linkedinOutreach !== undefined
          ? {
              linkedinOutreach:
                company.application!.connectionCount > 0
                  ? true
                  : dto.linkedinOutreach,
            }
          : {}),
        applied,
        applicationDate,
      },
    });

    return toPublic(await this.requireOwned(userId, id));
  }

  private async requireOwned(
    userId: string,
    id: string,
  ): Promise<CompanyWithApplication> {
    const company = await this.prisma.company.findFirst({
      where: { id, userId },
      include: {
        application: { include: { resume: { select: { id: true, title: true } } } },
      },
    });
    if (!company?.application) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }
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
