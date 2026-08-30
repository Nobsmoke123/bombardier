import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { CsvImportPublic, UserPublic } from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateImportDto } from './dto/create-import.dto.js';
import { ImportsService } from './imports.service.js';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(private readonly imports: ImportsService) {}

  @Post('import')
  import(
    @CurrentUser() user: UserPublic,
    @Body() dto: CreateImportDto,
  ): Promise<CsvImportPublic> {
    return this.imports.enqueue(user.id, dto);
  }

  @Get('imports/:id')
  findOne(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CsvImportPublic> {
    return this.imports.findOne(user.id, id);
  }
}
