import { ResumeFocus } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsEnum(ResumeFocus)
  focus!: ResumeFocus;

  @IsString()
  @MinLength(1)
  @MaxLength(512)
  fileKey!: string;
}
