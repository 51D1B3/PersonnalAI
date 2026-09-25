import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadMetadataDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  tags?: string; // Comma-separated string from multipart form
}
