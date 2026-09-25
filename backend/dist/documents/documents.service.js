var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocumentsService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let DocumentsService = DocumentsService_1 = class DocumentsService {
    supabaseService;
    logger = new Logger(DocumentsService_1.name);
    mockDocuments = [];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('documents').select('*');
            if (!error && data && data.length > 0) {
                return data.map((doc) => ({
                    id: doc.id,
                    title: doc.title,
                    description: doc.description,
                    category: doc.category || 'Général',
                    tags: doc.tags || [],
                    type: doc.file_type || 'PDF',
                    date: new Date(doc.created_at).toLocaleDateString('fr-FR'),
                    filePath: doc.file_path,
                    contentText: doc.content_text,
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Erreur de lecture Supabase: ${e}`);
        }
        return this.mockDocuments;
    }
    async create(createDocumentDto) {
        const newDoc = {
            id: `doc-${Date.now()}`,
            title: createDocumentDto.title,
            description: createDocumentDto.description,
            category: createDocumentDto.category || 'Général',
            tags: createDocumentDto.tags || ['Document'],
            type: 'PDF',
            date: new Date().toLocaleDateString('fr-FR'),
            filePath: createDocumentDto.filePath,
            contentText: createDocumentDto.contentText,
        };
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('documents').insert({
                title: createDocumentDto.title,
                description: createDocumentDto.description,
                category: createDocumentDto.category || 'Général',
                tags: createDocumentDto.tags || ['Document'],
                file_path: createDocumentDto.filePath,
                content_text: createDocumentDto.contentText,
            }).select().single();
            if (!error && data) {
                newDoc.id = data.id;
            }
        }
        catch (e) {
            this.logger.warn(`Erreur insertion Supabase: ${e}`);
        }
        this.mockDocuments.unshift(newDoc);
        return newDoc;
    }
    async remove(id) {
        try {
            const client = this.supabaseService.getClient();
            await client.from('documents').delete().eq('id', id);
        }
        catch (e) {
            this.logger.warn(`Erreur suppression Supabase: ${e}`);
        }
        this.mockDocuments = this.mockDocuments.filter(doc => doc.id !== id);
        return { success: true, id };
    }
};
DocumentsService = DocumentsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], DocumentsService);
export { DocumentsService };
//# sourceMappingURL=documents.service.js.map