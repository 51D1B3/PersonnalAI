var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotesService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let NotesService = NotesService_1 = class NotesService {
    supabaseService;
    logger = new Logger(NotesService_1.name);
    mockNotes = [
        {
            id: 'note-1',
            title: 'Notes de Configuration Supabase & JWT Tokens',
            description: 'Mémo pour la gestion des variables d\'environnement et des clés de rôles de service.',
            content: 'SUPABASE_URL=https://my-project.supabase.co\nDATABASE_URL=postgresql://...',
            category: 'Sécurité',
            tags: ['Config', 'Env', 'Tokens'],
            type: 'NOTE',
            isVault: true,
            date: '18 Septembre 2026',
        }
    ];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('notes').select('*');
            if (!error && data && data.length > 0) {
                return data.map((n) => ({
                    id: n.id,
                    title: n.title,
                    description: n.content ? n.content.substring(0, 100) : 'Note personnelle',
                    content: n.content,
                    category: n.category || 'Général',
                    tags: n.tags || [],
                    type: 'NOTE',
                    isVault: !!n.is_vault,
                    date: new Date(n.created_at).toLocaleDateString('fr-FR'),
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Erreur lecture notes Supabase: ${e}`);
        }
        return this.mockNotes;
    }
    async create(createNoteDto) {
        const newNote = {
            id: `note-${Date.now()}`,
            title: createNoteDto.title,
            description: createNoteDto.content.substring(0, 100),
            content: createNoteDto.content,
            category: createNoteDto.category || 'Général',
            tags: createNoteDto.tags || ['Note'],
            type: 'NOTE',
            isVault: !!createNoteDto.isVault,
            date: new Date().toLocaleDateString('fr-FR'),
        };
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('notes').insert({
                title: createNoteDto.title,
                content: createNoteDto.content,
                category: createNoteDto.category || 'Général',
                tags: createNoteDto.tags || ['Note'],
                is_vault: !!createNoteDto.isVault,
            }).select().single();
            if (!error && data) {
                newNote.id = data.id;
            }
        }
        catch (e) {
            this.logger.warn(`Erreur insertion note Supabase: ${e}`);
        }
        this.mockNotes.unshift(newNote);
        return newNote;
    }
};
NotesService = NotesService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], NotesService);
export { NotesService };
//# sourceMappingURL=notes.service.js.map