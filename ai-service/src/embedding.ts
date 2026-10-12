import { OllamaClient } from './ollama.client.js';
import { aiConfig } from './config.js';

export interface EmbeddingResult {
  text: string;
  vector: number[];
  dimensions: number;
  source: 'ollama' | 'deterministic-fallback';
  model: string;
}

export class EmbeddingService {
  private ollama: OllamaClient;
  private targetDim: number;

  constructor(ollama = new OllamaClient(), targetDim = aiConfig.embeddingDimensions) {
    this.ollama = ollama;
    this.targetDim = targetDim;
  }

  /**
   * Génère un embedding sémantique vectoriel pour n'importe quel texte
   */
  async generate(text: string): Promise<EmbeddingResult> {
    const input = text.trim();
    if (!input) {
      return {
        text: '',
        vector: new Array(this.targetDim).fill(0),
        dimensions: this.targetDim,
        source: 'deterministic-fallback',
        model: 'zero-vector',
      };
    }

    // 1. Essai avec Ollama en premier
    const ollamaVector = await this.ollama.getEmbedding(input);
    if (ollamaVector && ollamaVector.length > 0) {
      const adjusted = this.adjustDimensions(ollamaVector, this.targetDim);
      return {
        text: input,
        vector: adjusted,
        dimensions: adjusted.length,
        source: 'ollama',
        model: aiConfig.embeddingModel,
      };
    }

    // 2. Fallback déterministe autonome (100% fonctionnel hors ligne)
    const fallbackVector = this.createDeterministicVector(input, this.targetDim);
    return {
      text: input,
      vector: fallbackVector,
      dimensions: fallbackVector.length,
      source: 'deterministic-fallback',
      model: 'semantic-hash-l2',
    };
  }

  /**
   * Ajuste la dimension du vecteur (ex: 768 -> 1536) pour correspondre au pgvector Supabase
   */
  private adjustDimensions(vector: number[], targetDim: number): number[] {
    if (vector.length === targetDim) {
      return vector;
    }

    const result = new Array(targetDim).fill(0);
    for (let i = 0; i < targetDim; i++) {
      result[i] = vector[i % vector.length];
    }

    // Normalisation L2
    return this.normalizeL2(result);
  }

  /**
   * Génère un vecteur sémantique déterministe avec capture des n-grammes et normalisation L2
   */
  private createDeterministicVector(text: string, dimensions: number): number[] {
    const vector = new Array(dimensions).fill(0);
    const normalized = text.toLowerCase().trim();

    // Encodage par caractères et positions
    for (let i = 0; i < normalized.length; i++) {
      const code = normalized.charCodeAt(i);
      const idx = (code * 37 + (i + 1) * 17) % dimensions;
      vector[idx] += code / 255.0;
    }

    // Encodage sémantique des mots
    const words = normalized.split(/\s+/).filter(Boolean);
    words.forEach((w, wIdx) => {
      let hash = 0;
      for (let c = 0; c < w.length; c++) {
        hash = (hash * 31 + w.charCodeAt(c)) % dimensions;
      }
      vector[hash] += (wIdx + 1) * 1.5;

      // Bigrammes de mots
      if (wIdx < words.length - 1) {
        const bigram = `${w}_${words[wIdx + 1]}`;
        let biHash = 0;
        for (let c = 0; c < bigram.length; c++) {
          biHash = (biHash * 43 + bigram.charCodeAt(c)) % dimensions;
        }
        vector[biHash] += 2.0;
      }
    });

    return this.normalizeL2(vector);
  }

  /**
   * Normalisation euclidienne (L2 Norm)
   */
  private normalizeL2(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map((v) => Number((v / magnitude).toFixed(6)));
  }
}
