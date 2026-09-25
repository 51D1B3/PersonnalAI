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
export declare class SearchService {
    private readonly embeddingService;
    private readonly supabaseService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, supabaseService: SupabaseService);
    classicSearch(dto: ClassicSearchDto): Promise<SearchResultItem[]>;
    semanticSearch(dto: SemanticSearchDto): Promise<{
        query: string;
        results: SearchResultItem[];
    }>;
}
