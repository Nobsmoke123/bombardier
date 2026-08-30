import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type {
  PresignViewResponse,
  ResumePublic,
  UserPublic,
} from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateResumeDto } from './dto/create-resume.dto.js';
import { ResumesService } from './resumes.service.js';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumes: ResumesService) {}

  @Post()
  create(
    @CurrentUser() user: UserPublic,
    @Body() dto: CreateResumeDto,
  ): Promise<ResumePublic> {
    return this.resumes.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: UserPublic): Promise<ResumePublic[]> {
    return this.resumes.findAll(user.id);
  }

  @Get(':id/view')
  view(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PresignViewResponse> {
    return this.resumes.view(user.id, id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResumePublic> {
    return this.resumes.findOne(user.id, id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.resumes.remove(user.id, id);
  }
}
