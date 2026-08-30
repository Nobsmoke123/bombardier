import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, ResumeFocus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import { ResumesService } from './resumes.service.js';

describe('ResumesService', () => {
  let service: ResumesService;
  const prisma = {
    resume: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
  };
  const storage = {
    presignView: vi.fn(),
    deleteObject: vi.fn(),
  };

  const userId = '11111111-1111-1111-1111-111111111111';
  const resume = {
    id: '22222222-2222-2222-2222-222222222222',
    userId,
    title: 'Backend 2026',
    focus: ResumeFocus.BACKEND,
    fileKey: `users/${userId}/resumes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.pdf`,
    createdAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
      ],
    }).compile();

    service = module.get(ResumesService);
  });

  it('creates a resume from an owned object key', async () => {
    prisma.resume.create.mockResolvedValue(resume);

    const result = await service.create(userId, {
      title: 'Backend 2026',
      focus: ResumeFocus.BACKEND,
      fileKey: resume.fileKey,
    });

    expect(result.title).toBe('Backend 2026');
    expect(result.fileKey).toBe(resume.fileKey);
    expect(result).not.toHaveProperty('userId');
  });

  it('rejects a duplicate file key', async () => {
    prisma.resume.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.create(userId, {
        title: 'Backend 2026',
        focus: ResumeFocus.BACKEND,
        fileKey: resume.fileKey,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a signed view URL for an owned resume', async () => {
    prisma.resume.findFirst.mockResolvedValue(resume);
    storage.presignView.mockResolvedValue({
      viewUrl: 'https://r2.example/view',
      key: resume.fileKey,
      expiresIn: 900,
    });

    await expect(service.view(userId, resume.id)).resolves.toEqual({
      viewUrl: 'https://r2.example/view',
      key: resume.fileKey,
      expiresIn: 900,
    });
  });

  it('deletes the R2 object and the database record', async () => {
    prisma.resume.findFirst.mockResolvedValue(resume);
    storage.deleteObject.mockResolvedValue(undefined);
    prisma.resume.delete.mockResolvedValue(resume);

    await service.remove(userId, resume.id);

    expect(storage.deleteObject).toHaveBeenCalledWith(userId, resume.fileKey);
    expect(prisma.resume.delete).toHaveBeenCalledWith({
      where: { id: resume.id },
    });
  });

  it('404s when the resume is missing', async () => {
    prisma.resume.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, resume.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
