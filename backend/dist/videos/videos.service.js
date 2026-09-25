var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VideosService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let VideosService = VideosService_1 = class VideosService {
    supabaseService;
    logger = new Logger(VideosService_1.name);
    mockVideos = [];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('videos').select('*');
            if (!error && data && data.length > 0) {
                return data.map((v) => ({
                    id: v.id,
                    title: v.title,
                    description: v.description,
                    category: v.category || 'Général',
                    tags: v.tags || [],
                    type: 'VIDEO',
                    date: new Date(v.created_at).toLocaleDateString('fr-FR'),
                    videoPath: v.video_path,
                    transcript: v.transcript_text,
                }));
            }
        }
        catch (e) {
            this.logger.warn(`Erreur lecture vidéos Supabase: ${e}`);
        }
        return this.mockVideos;
    }
    async create(body) {
        const newVid = {
            id: `vid-${Date.now()}`,
            title: body.title,
            description: body.description,
            category: body.category || 'Général',
            tags: body.tags || ['Vidéo'],
            type: 'VIDEO',
            date: new Date().toLocaleDateString('fr-FR'),
            videoPath: body.videoPath || '/uploads/sample.mp4',
            transcript: body.transcript || 'Transcription automatique générée via Whisper',
        };
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client.from('videos').insert({
                title: body.title,
                description: body.description,
                category: body.category || 'Général',
                tags: body.tags || ['Vidéo'],
                video_path: newVid.videoPath,
                transcript_text: newVid.transcript,
            }).select().single();
            if (!error && data) {
                newVid.id = data.id;
            }
        }
        catch (e) {
            this.logger.warn(`Erreur insertion vidéo Supabase: ${e}`);
        }
        this.mockVideos.unshift(newVid);
        return newVid;
    }
};
VideosService = VideosService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], VideosService);
export { VideosService };
//# sourceMappingURL=videos.service.js.map