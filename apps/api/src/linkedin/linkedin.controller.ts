import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { LinkedInContactPublic, UserPublic } from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateLinkedInContactDto } from './dto/create-linkedin-contact.dto.js';
import { UpdateLinkedInContactDto } from './dto/update-linkedin-contact.dto.js';
import { LinkedInService } from './linkedin.service.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class LinkedInController {
  constructor(private readonly linkedin: LinkedInService) {}

  @Post('applications/:id/linkedin')
  create(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateLinkedInContactDto,
  ): Promise<LinkedInContactPublic> {
    return this.linkedin.create(user.id, id, dto);
  }

  @Get('applications/:id/linkedin')
  findAll(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LinkedInContactPublic[]> {
    return this.linkedin.findAll(user.id, id);
  }

  @Patch('linkedin/:id')
  update(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLinkedInContactDto,
  ): Promise<LinkedInContactPublic> {
    return this.linkedin.update(user.id, id, dto);
  }
}
