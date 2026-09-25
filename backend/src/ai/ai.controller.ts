import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmbeddingService } from './embedding.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  // Étape 31, 32, 34 : Status et détection Ollama local & modèle embedding
  @Get('status')
  async getStatus() {
    return this.embeddingService.checkOllamaStatus();
  }

  // Étape 33 : Tester l'IA indépendamment du site
  @Post('test')
  async testCompletion(@Body('prompt') prompt: string) {
    const query = prompt || 'Explique brièvement le rôle de useState dans React';
    return this.embeddingService.testAiCompletion(query);
  }

  // Étape 35 & 36 : Test du service d'embeddings (EmbeddingService)
  @Post('embedding')
  async generateEmbedding(@Body('text') text: string) {
    const input = text || 'Cours sur les hooks React';
    const vector = await this.embeddingService.generateEmbedding(input);
    return {
      text: input,
      vectorLength: vector.length,
      sampleDimensions: vector.slice(0, 5),
    };
  }
}
