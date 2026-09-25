import { EmbeddingService } from './embedding.service.js';
export declare class AiController {
    private readonly embeddingService;
    constructor(embeddingService: EmbeddingService);
    getStatus(): Promise<import("./embedding.service.js").OllamaStatus>;
    testCompletion(prompt: string): Promise<{
        success: boolean;
        output: string;
        model: string;
    }>;
    generateEmbedding(text: string): Promise<{
        text: string;
        vectorLength: number;
        sampleDimensions: number[];
    }>;
}
