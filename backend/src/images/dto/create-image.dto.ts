import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre de l\'image est obligatoire' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire' })
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsString()
  @IsOptional()
  ocrText?: string;
}
