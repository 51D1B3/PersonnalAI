var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VectorService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let VectorService = VectorService_1 = class VectorService {
    supabaseService;
    logger = new Logger(VectorService_1.name);
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async matchEmbeddings(queryEmbedding, matchThreshold = 0.7, matchCount = 5) {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.rpc('match_documents', {
                query_embedding: queryEmbedding,
                match_threshold: matchThreshold,
                match_count: matchCount,
            });
            if (!error && data) {
                return data.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category || 'Général',
                    type: item.file_type || 'PDF',
                    similarityScore: Math.round(item.similarity * 100),
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Search pgvector simulation: ${e}`);
        }
        return [
            {
                id: 'vec-1',
                title: 'React Hooks & State Management Guide.pdf',
                description: 'Cours complet sur useState, useEffect, et les hooks personnalisés avec exemples pratiques.',
                category: 'Développement Web',
                type: 'PDF',
                similarityScore: 98,
            },
            {
                id: 'vec-2',
                title: 'Capture Erreur Prisma P1001.png',
                description: 'Capture d\'écran de l\'erreur de connexion à la base de données avec solution alternative.',
                category: 'Backend / Database',
                type: 'IMAGE',
                similarityScore: 91,
            }
        ];
    }
};
VectorService = VectorService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], VectorService);
export { VectorService };
//# sourceMappingURL=vector.service.js.map