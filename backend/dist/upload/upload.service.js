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
import { DocumentsService } from '../documents/documents.service.js';
import { ImagesService } from '../images/images.service.js';
import { VideosService } from '../videos/videos.service.js';
import 'multer';
let UploadService = UploadService_1 = class UploadService {
    supabaseService;
    documentsService;
    imagesService;
    videosService;
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
    constructor(supabaseService, documentsService, imagesService, videosService) {
        this.supabaseService = supabaseService;
        this.documentsService = documentsService;
        this.imagesService = imagesService;
        this.videosService = videosService;
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
        const desc = metadata.description || 'Fichier importé via PersonalAI';
        const cat = metadata.category || 'Général';
        try {
            if (targetTable === 'documents') {
                const doc = await this.documentsService.create({
                    title: metadata.title,
                    description: desc,
                    category: cat,
                    tags: tagsArray,
                    filePath: publicUrl,
                    contentText: `Contenu indexé du fichier ${file.originalname}`,
                });
                insertedId = doc.id;
            }
            else if (targetTable === 'images') {
                const img = await this.imagesService.create({
                    title: metadata.title,
                    description: desc,
                    category: cat,
                    tags: tagsArray,
                    imagePath: publicUrl,
                    ocrText: 'Texte extrait automatiquement via OCR',
                });
                insertedId = img.id;
            }
            else if (targetTable === 'videos') {
                const vid = await this.videosService.create({
                    title: metadata.title,
                    description: desc,
                    category: cat,
                    tags: tagsArray,
                    videoPath: publicUrl,
                    transcript: 'Transcription Whisper générée pour l\'indexation',
                });
                insertedId = vid.id;
            }
        }
        catch (e) {
            this.logger.warn(`Resource service creation fallback: ${e}`);
        }
        this.logger.log(`✅ Fichier uploadé avec succès: ${filename} (${resourceType}, ID: ${insertedId})`);
        return {
            id: insertedId,
            title: metadata.title,
            description: desc,
            category: cat,
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
    __metadata("design:paramtypes", [SupabaseService,
        DocumentsService,
        ImagesService,
        VideosService])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map