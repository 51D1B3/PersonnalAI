import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre de la note est obligatoire' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Le contenu de la note est obligatoire' })
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isVault?: boolean;
}
