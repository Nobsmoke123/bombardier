import { ApplicationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

function emptyToNull(value: unknown) {
  if (value === '') {
    return null;
  }
  return value;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  role?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  resumeId?: string | null;

  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(20000)
  coverLetter?: string | null;

  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(5000)
  linkedinMessage?: string | null;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  applicationDate?: string | null;

  @IsOptional()
  @IsBoolean()
  linkedinOutreach?: boolean;
}
