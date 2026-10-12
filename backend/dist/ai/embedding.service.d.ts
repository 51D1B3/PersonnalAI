export interface OllamaStatus {
    connected: boolean;
    url: string;
    models: string[];
    activeModel: string;
    mode: 'AI_Service_Microservice' | 'Ollama_Direct' | 'Deterministic_Fallback';
    message: string;
}
export interface RagResponse {
    question: string;
    answer: string;
    sources: Array<{
        id: string;
        title: string;
        type: string;
        similarity: number;
        snippet: string;
    }>;
    usedOllama: boolean;
}
export declare class EmbeddingService {
    private readonly logger;
    private readonly aiServiceUrl;
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
    askRag(question: string, documents: any[]): Promise<RagResponse>;
    private adjustDimensions;
    private createMockEmbedding;
}
