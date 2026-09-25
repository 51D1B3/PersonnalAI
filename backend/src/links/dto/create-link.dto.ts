import { IsNotEmpty, IsOptional, IsString, IsArray, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du lien est obligatoire' })
  name: string;

  @IsUrl({}, { message: 'L\'URL renseignée n\'est pas valide' })
  @IsNotEmpty({ message: 'L\'URL est obligatoire' })
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
