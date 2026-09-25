import { EmbeddingService } from '../ai/embedding.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export interface WhisperTranscriptionResult {
    transcriptText: string;
    durationSeconds: number;
    language: string;
    embeddingDimensions: number;
    confidence: number;
}
export declare class WhisperService {
    private readonly embeddingService;
    private readonly supabaseService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, supabaseService: SupabaseService);
    transcribeVideo(videoPath: string, videoTitle: string): Promise<WhisperTranscriptionResult>;
}
