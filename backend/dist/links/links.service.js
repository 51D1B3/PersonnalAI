var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LinksService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let LinksService = LinksService_1 = class LinksService {
    supabaseService;
    logger = new Logger(LinksService_1.name);
    mockLinks = [];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('links').select('*');
            if (!error && data && data.length > 0) {
                return data.map((l) => ({
                    id: l.id,
                    name: l.name,
                    url: l.url,
                    description: l.description,
                    category: l.category || 'Général',
                    tags: l.tags || [],
                    type: 'LINK',
                    date: new Date(l.created_at).toLocaleDateString('fr-FR'),
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Erreur lecture links Supabase: ${e}`);
        }
        return this.mockLinks;
    }
    async create(createLinkDto) {
        const newLink = {
            id: `link-${Date.now()}`,
            name: createLinkDto.name,
            url: createLinkDto.url,
            description: createLinkDto.description || 'Lien web enregistré',
            category: createLinkDto.category || 'Général',
            tags: createLinkDto.tags || ['Web'],
            type: 'LINK',
            date: new Date().toLocaleDateString('fr-FR'),
        };
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('links').insert({
                name: createLinkDto.name,
                url: createLinkDto.url,
                description: createLinkDto.description,
                category: createLinkDto.category || 'Général',
                tags: createLinkDto.tags || ['Web'],
            }).select().single();
            if (!error && data) {
                newLink.id = data.id;
            }
        }
        catch (e) {
            this.logger.warn(`Erreur insertion link Supabase: ${e}`);
        }
        this.mockLinks.unshift(newLink);
        return newLink;
    }
};
LinksService = LinksService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], LinksService);
export { LinksService };
//# sourceMappingURL=links.service.js.map