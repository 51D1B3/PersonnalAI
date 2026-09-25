import { SupabaseService } from '../supabase/supabase.service.js';
export interface VectorSearchResult {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    similarityScore: number;
}
export declare class VectorService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    matchEmbeddings(queryEmbedding: number[], matchThreshold?: number, matchCount?: number): Promise<VectorSearchResult[]>;
}
