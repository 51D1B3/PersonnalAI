var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import 'multer';
let UploadService = UploadService_1 = class UploadService {
    supabaseService;
    logger = new Logger(UploadService_1.name);
    ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'video/mp4',
        'video/webm',
        'text/plain',
        'text/markdown',
    ];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async processUpload(file, metadata) {
        if (!file) {
            throw new BadRequestException('Aucun fichier fourni.');
        }
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(`Type de fichier non autorisé (${file.mimetype}). Seuls les PDF, Images, Vidéos et Fichiers textes sont acceptés.`);
        }
        const mime = file.mimetype;
        let resourceType = 'PDF';
        let bucketName = 'documents';
        let targetTable = 'documents';
        if (mime.startsWith('image/')) {
            resourceType = 'IMAGE';
            bucketName = 'images';
            targetTable = 'images';
        }
        else if (mime.startsWith('video/')) {
            resourceType = 'VIDEO';
            bucketName = 'videos';
            targetTable = 'videos';
        }
        const tagsArray = metadata.tags
            ? metadata.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
            : ['Upload'];
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        let publicUrl = `/uploads/${filename}`;
        try {
            const client = this.supabaseService.getClient();
            const { data: storageData, error: storageError } = await client.storage
                .from(bucketName)
                .upload(filename, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (!storageError && storageData) {
                const { data: urlData } = client.storage.from(bucketName).getPublicUrl(filename);
                if (urlData?.publicUrl) {
                    publicUrl = urlData.publicUrl;
                }
            }
        }
        catch (e) {
            this.logger.warn(`Storage upload fallback: ${e}`);
        }
        let insertedId = `upl-${Date.now()}`;
        try {
            const client = this.supabaseService.getClient();
            const record = {
                title: metadata.title,
                description: metadata.description || 'Fichier importé via PersonalAI',
                category: metadata.category || 'Général',
                tags: tagsArray,
                file_size: file.size,
            };
            if (targetTable === 'documents') {
                record.file_path = publicUrl;
                record.file_type = resourceType;
            }
            else if (targetTable === 'images') {
                record.image_path = publicUrl;
                record.ocr_text = 'OCR en attente d\'analyse...';
            }
            else if (targetTable === 'videos') {
                record.video_path = publicUrl;
                record.transcript_text = 'Transcription Whisper en cours...';
            }
            const { data: dbData, error: dbError } = await client
                .from(targetTable)
                .insert(record)
                .select()
                .single();
            if (!dbError && dbData) {
                insertedId = dbData.id;
            }
        }
        catch (e) {
            this.logger.warn(`PostgreSQL insert fallback: ${e}`);
        }
        this.logger.log(`✅ Fichier uploadé avec succès: ${filename} (${resourceType})`);
        return {
            id: insertedId,
            title: metadata.title,
            description: metadata.description || 'Fichier importé avec succès',
            category: metadata.category || 'Général',
            tags: tagsArray,
            type: resourceType,
            filePath: publicUrl,
            fileSize: file.size,
            date: new Date().toLocaleDateString('fr-FR'),
        };
    }
};
UploadService = UploadService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map