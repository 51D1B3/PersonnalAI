export interface OllamaStatus {
    connected: boolean;
    url: string;
    models: string[];
    activeModel: string;
    mode: 'Ollama_Local' | 'Deterministic_Fallback';
    message: string;
}
export declare class EmbeddingService {
    private readonly logger;
    private readonly ollamaUrl;
    private readonly embeddingModel;
    private readonly llmModel;
    checkOllamaStatus(): Promise<OllamaStatus>;
    testAiCompletion(prompt: string): Promise<{
        success: boolean;
        output: string;
        model: string;
    }>;
    generateEmbedding(text: string): Promise<number[]>;
    private createMockEmbedding;
}
