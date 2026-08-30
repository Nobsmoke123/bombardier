import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import type {
  PresignUploadResponse,
  PresignViewResponse,
  UserPublic,
} from '@job-tracker/types';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
import { ViewObjectDto } from './dto/view-object.dto.js';
import { StorageService } from './storage.service.js';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('presign')
  presign(
    @CurrentUser() user: UserPublic,
    @Body() dto: PresignUploadDto,
  ): Promise<PresignUploadResponse> {
    return this.storage.presignUpload(
      user.id,
      dto.folder,
      dto.filename,
      dto.contentType,
    );
  }

  @Get('view')
  view(
    @CurrentUser() user: UserPublic,
    @Query() query: ViewObjectDto,
  ): Promise<PresignViewResponse> {
    return this.storage.presignView(user.id, query.key);
  }
}
