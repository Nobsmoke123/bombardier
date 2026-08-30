import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import type {
  CompanyListResponse,
  CompanyPublic,
  CsvImportPublic,
  UserPublic,
} from '@job-tracker/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ImportsService } from '../imports/imports.service.js';
import { CompaniesService } from './companies.service.js';
import { ListCompaniesDto } from './dto/list-companies.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(
    private readonly companies: CompaniesService,
    private readonly imports: ImportsService,
  ) {}

  @Get()
  findAll(
    @CurrentUser() user: UserPublic,
    @Query() query: ListCompaniesDto,
  ): Promise<CompanyListResponse> {
    return this.companies.findAll(user.id, query);
  }

  @Get('imports')
  listImports(@CurrentUser() user: UserPublic): Promise<CsvImportPublic[]> {
    return this.imports.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompanyPublic> {
    return this.companies.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserPublic,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyPublic> {
    return this.companies.update(user.id, id, dto);
  }
}
