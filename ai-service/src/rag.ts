import { OllamaClient } from './ollama.client.js';
import { EmbeddingService } from './embedding.js';
import { SimilarityEngine } from './similarity.js';

export interface DocumentContext {
  id: string;
  title: string;
  content: string;
  type: string;
  category?: string;
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

export class RagEngine {
  private ollama: OllamaClient;
  private embeddingService: EmbeddingService;

  constructor(
    ollama = new OllamaClient(),
    embeddingService = new EmbeddingService(ollama)
  ) {
    this.ollama = ollama;
    this.embeddingService = embeddingService;
  }

  /**
   * Effectue une recherche sémantique puis génère une réponse augmentée par les documents
   */
  async ask(
    question: string,
    documents: DocumentContext[],
    maxSources = 3
  ): Promise<RagResponse> {
    const cleanQuestion = question.trim();

    // 1. Vectoriser la question
    const queryEmb = await this.embeddingService.generate(cleanQuestion);

    // 2. Vectoriser les documents candidats
    const embeddedDocs = await Promise.all(
      documents.map(async (doc) => {
        const textToEmbed = `${doc.title}\n${doc.category || ''}\n${doc.content}`;
        const emb = await this.embeddingService.generate(textToEmbed);
        return {
          item: doc,
          vector: emb.vector,
        };
      })
    );

    // 3. Trouver les documents les plus pertinents
    const topMatches = SimilarityEngine.rank(queryEmb.vector, embeddedDocs, maxSources);

    // 4. Construire le contexte pour l'IA
    const contextText = topMatches
      .map(
        (m, idx) =>
          `[Source ${idx + 1} - "${m.item.title}" (${m.item.type})]\n${m.item.content}`
      )
      .join('\n\n');

    const sources = topMatches.map((m) => ({
      id: m.item.id,
      title: m.item.title,
      type: m.item.type,
      similarity: m.percentage,
      snippet: m.item.content.substring(0, 160) + (m.item.content.length > 160 ? '...' : ''),
    }));

    // 5. Demander la synthèse au LLM
    const systemPrompt = `Tu es l'assistant personnel intelligent de PersonalAI.
Tu as accès aux documents, cours et notes privées de l'utilisateur.
Réponds à la question de manière claire, concise et précise en t'appuyant uniquement sur les sources fournies.
Si les sources ne contiennent pas la réponse, indique-le honnêtement.
Cite le nom des documents sources utilisés.`;

    const userPrompt = `Voici les sources trouvées dans ma mémoire numérique :
---------------------
${contextText || 'Aucun document pertinent trouvé.'}
---------------------

Question : ${cleanQuestion}

Ta réponse synthétique :`;

    const llmAnswer = await this.ollama.generateCompletion(userPrompt, systemPrompt);

    if (llmAnswer) {
      return {
        question: cleanQuestion,
        answer: llmAnswer.trim(),
        sources,
        usedOllama: true,
      };
    }

    // Fallback si Ollama n'est pas actif
    const topSource = topMatches[0];
    const fallbackAnswer = topSource
      ? `D'après votre document "${topSource.item.title}" (${topSource.percentage}% de pertinence sémantique) : "${topSource.item.content.substring(0, 220)}...". [Modèle Ollama local en attente de démarrage pour la synthèse complète]`
      : `Aucun document pertinent n'a été trouvé dans votre coffre-fort pour répondre à "${cleanQuestion}".`;

    return {
      question: cleanQuestion,
      answer: fallbackAnswer,
      sources,
      usedOllama: false,
    };
  }
}
