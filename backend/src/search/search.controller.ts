import { Controller, Get, Post, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { ClassicSearchDto } from './dto/classic-search.dto.js';
import { SemanticSearchDto } from './dto/semantic-search.dto.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // PHASE 7 : Étape 29 & 30 — Recherche classique avec filtres et tri
  @Get('classic')
  async classicSearch(@Query() queryDto: ClassicSearchDto) {
    return this.searchService.classicSearch(queryDto);
  }

  // PHASE 8 & 9 : Étape 38, 39, 40, 41 — POST /search/semantic (Recherche sémantique IA)
  @Post('semantic')
  @HttpCode(HttpStatus.OK)
  async semanticSearch(@Body() semanticDto: SemanticSearchDto) {
    return this.searchService.semanticSearch(semanticDto);
  }
}
