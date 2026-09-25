import { IsOptional, IsString, IsIn } from 'class-validator';

export class ClassicSearchDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  type?: string; // PDF | IMAGE | LINK | NOTE | VIDEO

  @IsString()
  @IsOptional()
  @IsIn(['date', 'title', 'relevance'])
  sortBy?: string = 'date';

  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}
