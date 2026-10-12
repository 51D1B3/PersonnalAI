import http from 'http';
import { aiConfig } from './config.js';
import { OllamaClient } from './ollama.client.js';
import { EmbeddingService } from './embedding.js';
import { SimilarityEngine } from './similarity.js';
import { RagEngine, type DocumentContext } from './rag.js';

const ollama = new OllamaClient();
const embeddingService = new EmbeddingService(ollama);
const ragEngine = new RagEngine(ollama, embeddingService);

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Gestion CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const url = req.url?.split('?')[0] || '/';

  try {
    // GET /status ou GET /health
    if (req.method === 'GET' && (url === '/status' || url === '/health' || url === '/')) {
      const status = await ollama.getStatus();
      return sendJson(res, 200, {
        service: 'PersonalAI - AI Microservice',
        port: aiConfig.port,
        config: aiConfig,
        ollama: status,
      });
    }

    // POST /embedding
    if (req.method === 'POST' && url === '/embedding') {
      const body = await parseJsonBody(req);
      const text = body.text || 'Exemple de texte pour PersonalAI';
      const result = await embeddingService.generate(text);
      return sendJson(res, 200, result);
    }

    // POST /search
    if (req.method === 'POST' && url === '/search') {
      const body = await parseJsonBody(req);
      const query = (body.query || '').trim();
      const documents: DocumentContext[] = body.documents || [];
      const limit = body.limit || 5;

      if (!query) {
        return sendJson(res, 400, { error: 'Le champ query est requis' });
      }

      const queryEmb = await embeddingService.generate(query);
      const candidates = await Promise.all(
        documents.map(async (doc) => {
          const emb = await embeddingService.generate(`${doc.title} ${doc.content}`);
          return { item: doc, vector: emb.vector };
        })
      );

      const results = SimilarityEngine.rank(queryEmb.vector, candidates, limit);
      return sendJson(res, 200, { query, count: results.length, results });
    }

    // POST /generate
    if (req.method === 'POST' && url === '/generate') {
      const body = await parseJsonBody(req);
      const prompt = body.prompt;
      if (!prompt) {
        return sendJson(res, 400, { error: 'Le champ prompt est requis' });
      }

      const completion = await ollama.generateCompletion(prompt, body.systemPrompt);
      return sendJson(res, 200, {
        prompt,
        response: completion || '[Ollama indisponible. Démarrez "ollama serve" pour la réponse LLM]',
        usedOllama: Boolean(completion),
      });
    }

    // POST /rag
    if (req.method === 'POST' && url === '/rag') {
      const body = await parseJsonBody(req);
      const question = body.question;
      const documents: DocumentContext[] = body.documents || [];

      if (!question) {
        return sendJson(res, 400, { error: 'Le champ question est requis' });
      }

      const ragRes = await ragEngine.ask(question, documents, body.maxSources || 3);
      return sendJson(res, 200, ragRes);
    }

    // 404 Route non trouvée
    sendJson(res, 404, { error: `Route introuvable : ${req.method} ${url}` });
  } catch (err: any) {
    sendJson(res, 500, { error: err.message || 'Erreur interne du service IA' });
  }
});

server.listen(aiConfig.port, () => {
  console.log(`🤖 [PersonalAI AI-Service] Serveur démarré sur http://localhost:${aiConfig.port}`);
  console.log(`   - Statut : http://localhost:${aiConfig.port}/status`);
  console.log(`   - Modèle Embeddings : ${aiConfig.embeddingModel}`);
  console.log(`   - Modèle LLM : ${aiConfig.llmModel}`);
});
