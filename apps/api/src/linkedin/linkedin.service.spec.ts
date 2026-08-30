import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { LinkedInService } from './linkedin.service.js';

describe('LinkedInService', () => {
  let service: LinkedInService;
  const userId = '11111111-1111-1111-1111-111111111111';
  const applicationId = '55555555-5555-5555-5555-555555555555';
  const contact = {
    id: '77777777-7777-7777-7777-777777777777',
    applicationId,
    name: 'Jordan Lee',
    position: 'Engineering manager',
    status: ConnectionStatus.PENDING,
    conversationNotes: '',
  };

  const prisma = {
    application: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    linkedInContact: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkedInService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(LinkedInService);
  });

  it('creates a contact and syncs connectionCount', async () => {
    prisma.application.findFirst.mockResolvedValue({ id: applicationId });
    prisma.linkedInContact.create.mockResolvedValue(contact);
    prisma.linkedInContact.count.mockResolvedValue(1);
    prisma.application.update.mockResolvedValue({ connectionCount: 1 });

    const result = await service.create(userId, applicationId, {
      name: 'Jordan Lee',
      position: 'Engineering manager',
    });

    expect(result.name).toBe('Jordan Lee');
    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: applicationId },
      data: { connectionCount: 1, linkedinOutreach: true },
    });
  });

  it('updates contact status', async () => {
    prisma.linkedInContact.findFirst.mockResolvedValue(contact);
    prisma.linkedInContact.update.mockResolvedValue({
      ...contact,
      status: ConnectionStatus.ACCEPTED,
    });
    prisma.linkedInContact.count.mockResolvedValue(1);
    prisma.application.update.mockResolvedValue({ connectionCount: 1 });

    const result = await service.update(userId, contact.id, {
      status: ConnectionStatus.ACCEPTED,
    });

    expect(result.status).toBe('ACCEPTED');
    expect(prisma.application.update).toHaveBeenCalled();
  });

  it('rejects whitespace-only names', async () => {
    prisma.application.findFirst.mockResolvedValue({ id: applicationId });

    await expect(
      service.create(userId, applicationId, {
        name: '   ',
        position: 'Engineer',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.linkedInContact.create).not.toHaveBeenCalled();
  });

  it('404s when the application is not owned', async () => {
    prisma.application.findFirst.mockResolvedValue(null);

    await expect(service.findAll(userId, applicationId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
