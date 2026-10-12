var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileValidationPipe_1;
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import 'multer';
let FileValidationPipe = FileValidationPipe_1 = class FileValidationPipe {
    logger = new Logger(FileValidationPipe_1.name);
    ALLOWED_EXTENSIONS = [
        'pdf',
        'png',
        'jpeg',
        'jpg',
        'webp',
        'gif',
        'mp4',
        'webm',
        'mkv',
        'avi',
        'txt',
        'md',
        'json',
    ];
    FORBIDDEN_EXTENSIONS = [
        'exe',
        'sh',
        'bat',
        'cmd',
        'js',
        'html',
        'htm',
        'php',
        'py',
        'dll',
        'vbs',
        'ps1',
        'scr',
        'msi',
        'jar',
    ];
    ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'video/x-matroska',
        'video/avi',
        'text/plain',
        'text/markdown',
        'application/json',
    ];
    MAX_SIZE_VIDEO = 50 * 1024 * 1024;
    MAX_SIZE_PDF = 20 * 1024 * 1024;
    MAX_SIZE_IMAGE = 10 * 1024 * 1024;
    MAX_SIZE_TEXT = 5 * 1024 * 1024;
    transform(file) {
        if (!file) {
            throw new BadRequestException('❌ Validation échouée : Aucun fichier fourni.');
        }
        const filename = file.originalname || '';
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        if (this.FORBIDDEN_EXTENSIONS.includes(ext)) {
            this.logger.error(`🚨 Fichier exécutable/dangereux détecté et rejeté: ${filename} (.${ext})`);
            throw new BadRequestException(`🚨 Sécurité : Le fichier ".${ext}" est considéré comme exécutable et potentiellement dangereux. Upload annulé.`);
        }
        if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
            throw new BadRequestException(`❌ Extension non autorisée (.${ext}). Seules les extensions suivantes sont autorisées : ${this.ALLOWED_EXTENSIONS.join(', ')}.`);
        }
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(`❌ Type MIME non autorisé (${file.mimetype}).`);
        }
        if (file.mimetype.startsWith('video/') && file.size > this.MAX_SIZE_VIDEO) {
            throw new BadRequestException(`❌ Taille de vidéo trop volumineuse (max 50 Mo).`);
        }
        else if (file.mimetype === 'application/pdf' && file.size > this.MAX_SIZE_PDF) {
            throw new BadRequestException(`❌ Document PDF trop volumineux (max 20 Mo).`);
        }
        else if (file.mimetype.startsWith('image/') && file.size > this.MAX_SIZE_IMAGE) {
            throw new BadRequestException(`❌ Image trop volumineuse (max 10 Mo).`);
        }
        else if (file.size > this.MAX_SIZE_VIDEO) {
            throw new BadRequestException(`❌ Fichier trop volumineux.`);
        }
        if (file.buffer && file.buffer.length > 4) {
            this.validateMagicBytes(file.buffer, file.mimetype, ext);
        }
        this.logger.log(`✅ Fichier validé avec succès (Validation Stricte Étape 52): ${filename}`);
        return file;
    }
    validateMagicBytes(buffer, mime, ext) {
        const headerHex = buffer.subarray(0, 8).toString('hex').toUpperCase();
        if (mime === 'application/pdf' || ext === 'pdf') {
            if (!headerHex.startsWith('25504446')) {
                throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un vrai PDF.`);
            }
        }
        else if (mime === 'image/png' || ext === 'png') {
            if (!headerHex.startsWith('89504E47')) {
                throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un PNG.`);
            }
        }
        else if (mime === 'image/jpeg' || ext === 'jpg' || ext === 'jpeg') {
            if (!headerHex.startsWith('FFD8FF')) {
                throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un JPEG.`);
            }
        }
        else if (mime === 'image/gif' || ext === 'gif') {
            if (!headerHex.startsWith('47494638')) {
                throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un GIF.`);
            }
        }
    }
};
FileValidationPipe = FileValidationPipe_1 = __decorate([
    Injectable()
], FileValidationPipe);
export { FileValidationPipe };
//# sourceMappingURL=file-validation.pipe.js.map