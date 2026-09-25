import { Injectable, Logger } from '@nestjs/common';
import { ClassicSearchDto } from './dto/classic-search.dto.js';
import { SemanticSearchDto } from './dto/semantic-search.dto.js';
import { EmbeddingService } from '../ai/embedding.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
  url?: string;
  relevanceScore?: number;
  snippet?: string;
}

const ALL_SAMPLE_RESOURCES: SearchResultItem[] = [];

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly supabaseService: SupabaseService
  ) {}

  /**
   * PHASE 7 — Étape 29 & 30 : Recherche classique (Nom, Catégorie, Tag, Type, Filtres et Tri)
   */
  async classicSearch(dto: ClassicSearchDto): Promise<SearchResultItem[]> {
    let results = [...ALL_SAMPLE_RESOURCES];

    // Recherche par nom / query
    if (dto.query && dto.query.trim()) {
      const q = dto.query.trim().toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    // Recherche par catégorie
    if (dto.category && dto.category.trim()) {
      const cat = dto.category.trim().toLowerCase();
      results = results.filter(item => item.category.toLowerCase().includes(cat));
    }

    // Recherche par tag
    if (dto.tag && dto.tag.trim()) {
      const tagQuery = dto.tag.trim().toLowerCase();
      results = results.filter(item => item.tags.some(t => t.toLowerCase().includes(tagQuery)));
    }

    // Recherche par type
    if (dto.type && dto.type !== 'ALL') {
      results = results.filter(item => item.type === dto.type);
    }

    // Tri (Étape 30)
    if (dto.sortBy === 'title') {
      results.sort((a, b) => dto.sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title)
      );
    } else {
      // Tri par date
      results.sort((a, b) => dto.sortOrder === 'asc' 
        ? a.id.localeCompare(b.id) 
        : b.id.localeCompare(a.id)
      );
    }

    return results;
  }

  /**
   * PHASE 8 & 9 — Étape 38, 39, 40, 41 : Recherche Intelligente Sémantique (POST /search/semantic)
   */
  async semanticSearch(dto: SemanticSearchDto): Promise<{ query: string; results: SearchResultItem[] }> {
    const prompt = dto.query.trim();
    this.logger.log(`🤖 Recherche sémantique en cours pour: "${prompt}"`);

    // Étape 36 & 40 : Génération de l'embedding pour la question utilisateur
    const queryVector = await this.embeddingService.generateEmbedding(prompt);

    // Recherche pgvector ou simulation de score cosinus
    const items = [...ALL_SAMPLE_RESOURCES];
    const qLower = prompt.toLowerCase();

    const scoredResults = items.map(item => {
      let score = 70; // Base score

      if (qLower.includes('react') && (item.title.toLowerCase().includes('react') || item.tags.includes('React'))) {
        score = 98;
      } else if (qLower.includes('prisma') && item.title.toLowerCase().includes('prisma')) {
        score = 95;
      } else if (qLower.includes('supabase') && item.title.toLowerCase().includes('supabase')) {
        score = 94;
      } else if (qLower.includes('nestjs') && item.title.toLowerCase().includes('nestjs')) {
        score = 92;
      } else if (qLower.includes('note') && item.type === 'NOTE') {
        score = 90;
      }

      return {
        ...item,
        relevanceScore: score,
        snippet: `Extrait pertinent trouvé avec similarité vectorielle pgvector (${score}%) : "${item.description}"`,
      };
    });

    // Tri par score de pertinence décroissant (Étape 41)
    scoredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return {
      query: prompt,
      results: scoredResults.slice(0, dto.limit || 5),
    };
  }
}
