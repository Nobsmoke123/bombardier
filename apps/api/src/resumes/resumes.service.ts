import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ResumePublic } from '@job-tracker/types';
import { Prisma, type Resume } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { assertResumeFileKey } from '../storage/storage.keys.js';
import { StorageService } from '../storage/storage.service.js';
import type { CreateResumeDto } from './dto/create-resume.dto.js';

@Injectable()
export class ResumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async create(userId: string, dto: CreateResumeDto): Promise<ResumePublic> {
    assertResumeFileKey(userId, dto.fileKey);

    try {
      const resume = await this.prisma.resume.create({
        data: {
          userId,
          title: dto.title.trim(),
          focus: dto.focus,
          fileKey: dto.fileKey,
        },
      });
      return toPublic(resume);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This file has already been saved as a resume',
        );
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<ResumePublic[]> {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return resumes.map(toPublic);
  }

  async findOne(userId: string, id: string): Promise<ResumePublic> {
    return toPublic(await this.requireOwned(userId, id));
  }

  async view(userId: string, id: string) {
    const resume = await this.requireOwned(userId, id);
    return this.storage.presignView(userId, resume.fileKey);
  }

  async remove(userId: string, id: string): Promise<void> {
    const resume = await this.requireOwned(userId, id);
    await this.prisma.resume.delete({ where: { id: resume.id } });
    try {
      await this.storage.deleteObject(userId, resume.fileKey);
    } catch {
      // Keep the delete successful if the object is already gone.
    }
  }

  private async requireOwned(userId: string, id: string): Promise<Resume> {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }
}

function toPublic(resume: Resume): ResumePublic {
  return {
    id: resume.id,
    title: resume.title,
    focus: resume.focus,
    fileKey: resume.fileKey,
    createdAt: resume.createdAt.toISOString(),
  };
}
