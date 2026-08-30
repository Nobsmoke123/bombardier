import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateImportDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[^\\/]+\.csv$/i)
  filename!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(512)
  objectKey!: string;
}
