import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';
import 'multer';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly logger = new Logger(FileValidationPipe.name);

  // Whitelisted extensions
  private readonly ALLOWED_EXTENSIONS = [
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

  // Dangerous blacklisted extensions (strict rejection)
  private readonly FORBIDDEN_EXTENSIONS = [
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

  // Whitelisted MIME types
  private readonly ALLOWED_MIME_TYPES = [
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

  // Max sizes per type in Bytes
  private readonly MAX_SIZE_VIDEO = 50 * 1024 * 1024; // 50 MB
  private readonly MAX_SIZE_PDF = 20 * 1024 * 1024; // 20 MB
  private readonly MAX_SIZE_IMAGE = 10 * 1024 * 1024; // 10 MB
  private readonly MAX_SIZE_TEXT = 5 * 1024 * 1024; // 5 MB

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('❌ Validation échouée : Aucun fichier fourni.');
    }

    const filename = file.originalname || '';
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    // 1. Rejet strict des extensions dangereuses / exécutables
    if (this.FORBIDDEN_EXTENSIONS.includes(ext)) {
      this.logger.error(`🚨 Fichier exécutable/dangereux détecté et rejeté: ${filename} (.${ext})`);
      throw new BadRequestException(
        `🚨 Sécurité : Le fichier ".${ext}" est considéré comme exécutable et potentiellement dangereux. Upload annulé.`
      );
    }

    // 2. Vérification liste blanche d'extensions
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `❌ Extension non autorisée (.${ext}). Seules les extensions suivantes sont autorisées : ${this.ALLOWED_EXTENSIONS.join(', ')}.`
      );
    }

    // 3. Vérification du MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `❌ Type MIME non autorisé (${file.mimetype}).`
      );
    }

    // 4. Limite de taille par type de contenu
    if (file.mimetype.startsWith('video/') && file.size > this.MAX_SIZE_VIDEO) {
      throw new BadRequestException(`❌ Taille de vidéo trop volumineuse (max 50 Mo).`);
    } else if (file.mimetype === 'application/pdf' && file.size > this.MAX_SIZE_PDF) {
      throw new BadRequestException(`❌ Document PDF trop volumineux (max 20 Mo).`);
    } else if (file.mimetype.startsWith('image/') && file.size > this.MAX_SIZE_IMAGE) {
      throw new BadRequestException(`❌ Image trop volumineuse (max 10 Mo).`);
    } else if (file.size > this.MAX_SIZE_VIDEO) {
      throw new BadRequestException(`❌ Fichier trop volumineux.`);
    }

    // 5. Validation par Magic Bytes (inspection de la signature binaire du header)
    if (file.buffer && file.buffer.length > 4) {
      this.validateMagicBytes(file.buffer, file.mimetype, ext);
    }

    this.logger.log(`✅ Fichier validé avec succès (Validation Stricte Étape 52): ${filename}`);
    return file;
  }

  private validateMagicBytes(buffer: Buffer, mime: string, ext: string): void {
    const headerHex = buffer.subarray(0, 8).toString('hex').toUpperCase();

    if (mime === 'application/pdf' || ext === 'pdf') {
      // PDF standard magic bytes: %PDF (hex 25504446)
      if (!headerHex.startsWith('25504446')) {
        throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un vrai PDF.`);
      }
    } else if (mime === 'image/png' || ext === 'png') {
      // PNG magic bytes: 89504E47
      if (!headerHex.startsWith('89504E47')) {
        throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un PNG.`);
      }
    } else if (mime === 'image/jpeg' || ext === 'jpg' || ext === 'jpeg') {
      // JPEG magic bytes: FFD8FF
      if (!headerHex.startsWith('FFD8FF')) {
        throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un JPEG.`);
      }
    } else if (mime === 'image/gif' || ext === 'gif') {
      // GIF magic bytes: 47494638 (GIF8)
      if (!headerHex.startsWith('47494638')) {
        throw new BadRequestException(`🚨 Fichier corrompu ou falsifié : L'en-tête binaire ne correspond pas à un GIF.`);
      }
    }
  }
}
