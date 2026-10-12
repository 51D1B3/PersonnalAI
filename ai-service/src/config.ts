import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charge le fichier .env depuis le dossier ai-service
dotenv.config({ path: resolve(__dirname, '../.env') });

export const aiConfig = {
  port: parseInt(process.env.AI_SERVICE_PORT || '5000', 10),
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text',
  llmModel: process.env.LLM_MODEL || 'llama3',
  embeddingDimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1536', 10),
};
