import { aiConfig } from './config.js';

export interface OllamaStatusResult {
  isOnline: boolean;
  url: string;
  models: string[];
  hasEmbeddingModel: boolean;
  hasLlmModel: boolean;
  message: string;
}

export class OllamaClient {
  private url: string;
  private embeddingModel: string;
  private llmModel: string;

  constructor(
    url = aiConfig.ollamaUrl,
    embeddingModel = aiConfig.embeddingModel,
    llmModel = aiConfig.llmModel
  ) {
    this.url = url;
    this.embeddingModel = embeddingModel;
    this.llmModel = llmModel;
  }

  /**
   * Vérifie la connexion avec le serveur local Ollama et détecte les modèles installés
   */
  async getStatus(): Promise<OllamaStatusResult> {
    try {
      const response = await fetch(`${this.url}/api/tags`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = (await response.json()) as { models?: Array<{ name?: string; model?: string }> };
        const modelNames = (data.models || []).map((m) => m.name || m.model || '');

        const hasEmbeddingModel = modelNames.some((m) =>
          m.toLowerCase().includes(this.embeddingModel.toLowerCase().split(':')[0])
        );

        const hasLlmModel = modelNames.some((m) =>
          m.toLowerCase().includes(this.llmModel.toLowerCase().split(':')[0])
        );

        return {
          isOnline: true,
          url: this.url,
          models: modelNames,
          hasEmbeddingModel,
          hasLlmModel,
          message: `Ollama connecté avec succès sur ${this.url}. Modèles détectés : ${modelNames.length}`,
        };
      }
    } catch {
      // Ollama n'est pas encore démarré
    }

    return {
      isOnline: false,
      url: this.url,
      models: [],
      hasEmbeddingModel: false,
      hasLlmModel: false,
      message: `Ollama n'est pas accessible sur ${this.url}. Démarrez-le avec la commande: ollama serve`,
    };
  }

  /**
   * Génère un vecteur d'embedding via l'API Ollama (/api/embed ou /api/embeddings)
   */
  async getEmbedding(text: string, model = this.embeddingModel): Promise<number[] | null> {
    const cleanText = text.trim();
    if (!cleanText) return null;

    try {
      // API moderne Ollama (/api/embed)
      const res = await fetch(`${this.url}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, input: cleanText }),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = (await res.json()) as { embeddings?: number[][] };
        if (data.embeddings && data.embeddings.length > 0) {
          return data.embeddings[0];
        }
      }

      // API classique Ollama (/api/embeddings)
      const resLegacy = await fetch(`${this.url}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: cleanText }),
        signal: AbortSignal.timeout(10000),
      });

      if (resLegacy.ok) {
        const data = (await resLegacy.json()) as { embedding?: number[] };
        if (data.embedding && Array.isArray(data.embedding)) {
          return data.embedding;
        }
      }
    } catch {
      // Échec ou timeout
    }

    return null;
  }

  /**
   * Génère une complétion texte via Ollama (/api/generate)
   */
  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    model = this.llmModel
  ): Promise<string | null> {
    try {
      const res = await fetch(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          system: systemPrompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (res.ok) {
        const data = (await res.json()) as { response?: string };
        return data.response || null;
      }
    } catch {
      // Ollama indisponible
    }

    return null;
  }
}
