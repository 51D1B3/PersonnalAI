import { EmbeddingService } from '../ai/embedding.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export interface OcrAnalysisResult {
    ocrText: string;
    embeddingDimensions: number;
    confidence: number;
    extractedKeywords: string[];
}
export declare class OcrService {
    private readonly embeddingService;
    private readonly supabaseService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, supabaseService: SupabaseService);
    processImageOcr(imagePath: string, imageTitle: string): Promise<OcrAnalysisResult>;
}
