import { Injectable, NotFoundException } from '@nestjs/common';
import type { LinkedInContactPublic } from '@job-tracker/types';
import type { LinkedInContact } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateLinkedInContactDto } from './dto/create-linkedin-contact.dto.js';
import type { UpdateLinkedInContactDto } from './dto/update-linkedin-contact.dto.js';

@Injectable()
export class LinkedInService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    applicationId: string,
    dto: CreateLinkedInContactDto,
  ): Promise<LinkedInContactPublic> {
    await this.requireOwnedApplication(userId, applicationId);

    const contact = await this.prisma.linkedInContact.create({
      data: {
        applicationId,
        name: dto.name.trim(),
        position: dto.position.trim(),
        status: dto.status,
        conversationNotes: dto.conversationNotes?.trim() ?? '',
      },
    });

    await this.syncConnectionCount(applicationId);
    return toPublic(contact);
  }

  async findAll(
    userId: string,
    applicationId: string,
  ): Promise<LinkedInContactPublic[]> {
    await this.requireOwnedApplication(userId, applicationId);
    const contacts = await this.prisma.linkedInContact.findMany({
      where: { applicationId },
      orderBy: { name: 'asc' },
    });
    return contacts.map(toPublic);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateLinkedInContactDto,
  ): Promise<LinkedInContactPublic> {
    const contact = await this.requireOwnedContact(userId, id);

    const updated = await this.prisma.linkedInContact.update({
      where: { id: contact.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.position !== undefined ? { position: dto.position.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.conversationNotes !== undefined
          ? { conversationNotes: dto.conversationNotes.trim() }
          : {}),
      },
    });

    await this.syncConnectionCount(contact.applicationId);
    return toPublic(updated);
  }

  private async requireOwnedApplication(userId: string, applicationId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, company: { userId } },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  private async requireOwnedContact(userId: string, id: string) {
    const contact = await this.prisma.linkedInContact.findFirst({
      where: { id, application: { company: { userId } } },
    });
    if (!contact) {
      throw new NotFoundException('LinkedIn contact not found');
    }
    return contact;
  }

  private async syncConnectionCount(applicationId: string) {
    const connectionCount = await this.prisma.linkedInContact.count({
      where: { applicationId },
    });

    await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        connectionCount,
        ...(connectionCount > 0 ? { linkedinOutreach: true } : {}),
      },
    });
  }
}

function toPublic(contact: LinkedInContact): LinkedInContactPublic {
  return {
    id: contact.id,
    applicationId: contact.applicationId,
    name: contact.name,
    position: contact.position,
    status: contact.status,
    conversationNotes: contact.conversationNotes,
  };
}
