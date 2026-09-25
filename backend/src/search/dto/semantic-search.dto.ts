import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class SemanticSearchDto {
  @IsString()
  @IsNotEmpty({ message: 'La question ou phrase de recherche est obligatoire' })
  query: string;

  @IsNumber()
  @IsOptional()
  limit?: number = 5;
}
