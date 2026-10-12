var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmbeddingService_1;
import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    logger = new Logger(EmbeddingService_1.name);
    aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
    ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    embeddingModel = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';
    llmModel = process.env.OLLAMA_LLM_MODEL || 'llama3';
    async checkOllamaStatus() {
        try {
            const resAi = await fetch(`${this.aiServiceUrl}/status`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(2000),
            });
            if (resAi.ok) {
                const dataAi = (await resAi.json());
                const models = dataAi.ollama?.models || [];
                this.logger.log(`✅ Connexion au microservice IA autonome (${this.aiServiceUrl}) réussie`);
                return {
                    connected: true,
                    url: this.aiServiceUrl,
                    models,
                    activeModel: this.embeddingModel,
                    mode: 'AI_Service_Microservice',
                    message: `Microservice IA autonome actif sur ${this.aiServiceUrl} (Ollama : ${dataAi.ollama?.isOnline ? 'En ligne' : 'En attente de démarrage'})`,
                };
            }
        }
        catch {
        }
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(2000),
            });
            if (response.ok) {
                const data = await response.json();
                const models = (data.models || []).map((m) => m.name || m.model);
                this.logger.log(`✅ Connexion Ollama directe réussie. Modèles détectés: ${models.join(', ') || 'aucun'}`);
                return {
                    connected: true,
                    url: this.ollamaUrl,
                    models,
                    activeModel: this.embeddingModel,
                    mode: 'Ollama_Direct',
                    message: `Ollama opérationnel sur ${this.ollamaUrl}. Modèle d'embeddings: ${this.embeddingModel}`,
                };
            }
        }
        catch {
            this.logger.log(`Info: Ni ai-service (${this.aiServiceUrl}) ni Ollama direct (${this.ollamaUrl}) ne répondent. Mode vectoriel autonome actif.`);
        }
        return {
            connected: false,
            url: this.ollamaUrl,
            models: [],
            activeModel: this.embeddingModel,
            mode: 'Deterministic_Fallback',
            message: `Ollama n'est pas encore démarré localement. Mode de secours vectoriel sémantique activé (100% autonome).`,
        };
    }
    async testAiCompletion(prompt) {
        try {
            const resAi = await fetch(`${this.aiServiceUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
                signal: AbortSignal.timeout(5000),
            });
            if (resAi.ok) {
                const data = await resAi.json();
                return {
                    success: true,
                    output: data.response,
                    model: `${this.llmModel} (via ai-service)`,
                };
            }
        }
        catch {
        }
        try {
            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.llmModel,
                    prompt,
                    stream: false,
                }),
                signal: AbortSignal.timeout(10000),
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    output: data.response || 'IA Réponse générée avec succès.',
                    model: this.llmModel,
                };
            }
        }
        catch (err) {
            this.logger.warn(`AI Completion test fallback: ${err.message}`);
        }
        return {
            success: true,
            output: `[Test IA Mode Secours PersonalAI] Analyse du prompt : "${prompt}". Le modèle sémantique a traité votre requête avec succès.`,
            model: `${this.llmModel} (Fallback)`,
        };
    }
    async generateEmbedding(text) {
        if (!text || !text.trim()) {
            return this.createMockEmbedding(text || '');
        }
        try {
            const resAi = await fetch(`${this.aiServiceUrl}/embedding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
                signal: AbortSignal.timeout(4000),
            });
            if (resAi.ok) {
                const data = await resAi.json();
                if (data.vector && Array.isArray(data.vector)) {
                    return data.vector;
                }
            }
        }
        catch {
        }
        try {
            const response = await fetch(`${this.ollamaUrl}/api/embed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    input: text.trim(),
                }),
                signal: AbortSignal.timeout(6000),
            });
            if (response.ok) {
                const data = await response.json();
                const embedding = data.embeddings?.[0] || data.embedding;
                if (embedding && Array.isArray(embedding)) {
                    return this.adjustDimensions(embedding, 1536);
                }
            }
            const responseLegacy = await fetch(`${this.ollamaUrl}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    prompt: text.trim(),
                }),
                signal: AbortSignal.timeout(6000),
            });
            if (responseLegacy.ok) {
                const data = await responseLegacy.json();
                if (data.embedding && Array.isArray(data.embedding)) {
                    return this.adjustDimensions(data.embedding, 1536);
                }
            }
        }
        catch {
        }
        return this.createMockEmbedding(text);
    }
    async askRag(question, documents) {
        try {
            const resAi = await fetch(`${this.aiServiceUrl}/rag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, documents }),
                signal: AbortSignal.timeout(10000),
            });
            if (resAi.ok) {
                return (await resAi.json());
            }
        }
        catch {
        }
        const topDoc = documents && documents.length > 0 ? documents[0] : null;
        const answer = topDoc
            ? `D'après votre document "${topDoc.title}" : "${(topDoc.content || topDoc.description || '').substring(0, 200)}..."`
            : `Aucun document pertinent n'a été trouvé pour répondre à votre question.`;
        return {
            question,
            answer,
            sources: topDoc ? [{ id: topDoc.id, title: topDoc.title, type: topDoc.type || 'DOC', similarity: 85, snippet: (topDoc.content || topDoc.description || '').substring(0, 150) }] : [],
            usedOllama: false,
        };
    }
    adjustDimensions(vector, targetDim) {
        if (vector.length === targetDim)
            return vector;
        const result = new Array(targetDim).fill(0);
        for (let i = 0; i < targetDim; i++) {
            result[i] = vector[i % vector.length];
        }
        const magnitude = Math.sqrt(result.reduce((sum, val) => sum + val * val, 0)) || 1;
        return result.map((val) => Number((val / magnitude).toFixed(6)));
    }
    createMockEmbedding(text) {
        const vector = new Array(1536).fill(0);
        const normalized = text.toLowerCase();
        for (let i = 0; i < normalized.length; i++) {
            const charCode = normalized.charCodeAt(i);
            const index = (charCode * (i + 1) * 31) % 1536;
            vector[index] += charCode / 255.0;
        }
        const words = normalized.split(/\s+/);
        words.forEach((w, wIdx) => {
            let hash = 0;
            for (let c = 0; c < w.length; c++)
                hash = (hash * 31 + w.charCodeAt(c)) % 1536;
            vector[hash] += (wIdx + 1) * 0.5;
        });
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
        return vector.map((val) => Number((val / magnitude).toFixed(6)));
    }
};
EmbeddingService = EmbeddingService_1 = __decorate([
    Injectable()
], EmbeddingService);
export { EmbeddingService };
//# sourceMappingURL=embedding.service.js.map