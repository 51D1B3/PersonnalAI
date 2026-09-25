var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImagesService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let ImagesService = ImagesService_1 = class ImagesService {
    supabaseService;
    logger = new Logger(ImagesService_1.name);
    mockImages = [];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('images').select('*');
            if (!error && data && data.length > 0) {
                return data.map((img) => ({
                    id: img.id,
                    title: img.title,
                    description: img.description,
                    category: img.category || 'Général',
                    tags: img.tags || [],
                    type: 'IMAGE',
                    date: new Date(img.created_at).toLocaleDateString('fr-FR'),
                    imagePath: img.image_path,
                    ocrText: img.ocr_text,
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Erreur lecture images Supabase: ${e}`);
        }
        return this.mockImages;
    }
    async create(createImageDto) {
        const newImg = {
            id: `img-${Date.now()}`,
            title: createImageDto.title,
            description: createImageDto.description,
            category: createImageDto.category || 'Général',
            tags: createImageDto.tags || ['Capture'],
            type: 'IMAGE',
            date: new Date().toLocaleDateString('fr-FR'),
            imagePath: createImageDto.imagePath || '/uploads/sample.png',
            ocrText: createImageDto.ocrText || 'Texte extrait automatiquement via Tesseract OCR',
        };
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('images').insert({
                title: createImageDto.title,
                description: createImageDto.description,
                category: createImageDto.category || 'Général',
                tags: createImageDto.tags || ['Capture'],
                image_path: newImg.imagePath,
                ocr_text: newImg.ocrText,
            }).select().single();
            if (!error && data) {
                newImg.id = data.id;
            }
        }
        catch (e) {
            this.logger.warn(`Erreur insertion image Supabase: ${e}`);
        }
        this.mockImages.unshift(newImg);
        return newImg;
    }
};
ImagesService = ImagesService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], ImagesService);
export { ImagesService };
//# sourceMappingURL=images.service.js.map