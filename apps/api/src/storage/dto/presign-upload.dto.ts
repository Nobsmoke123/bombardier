import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { STORAGE_FOLDERS } from '../storage.constants.js';

export class PresignUploadDto {
  @IsIn(STORAGE_FOLDERS)
  folder!: (typeof STORAGE_FOLDERS)[number];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[^\\/]+$/)
  filename!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(127)
  contentType!: string;
}
