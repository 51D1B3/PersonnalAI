import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre du document est obligatoire' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La description du document est obligatoire' })
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  filePath?: string;

  @IsString()
  @IsOptional()
  contentText?: string;
}
