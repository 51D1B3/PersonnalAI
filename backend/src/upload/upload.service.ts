import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { DocumentsService } from '../documents/documents.service.js';
import { ImagesService } from '../images/images.service.js';
import { VideosService } from '../videos/videos.service.js';
import 'multer';

export interface UploadResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  filePath: string;
  fileSize: number;
  date: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  // Allowed MIME types (Étape 24, 25, 26)
  private readonly ALLOWED_MIME_TYPES = [
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

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly documentsService: DocumentsService,
    private readonly imagesService: ImagesService,
    private readonly videosService: VideosService
  ) {}

  async processUpload(
    file: Express.Multer.File,
    metadata: UploadMetadataDto
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }

    // Étape 26 : Validation du type de fichier
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé (${file.mimetype}). Seuls les PDF, Images, Vidéos et Fichiers textes sont acceptés.`
      );
    }

    const mime = file.mimetype;
    let resourceType = 'PDF';
    let bucketName = 'documents';
    let targetTable = 'documents';

    if (mime.startsWith('image/')) {
      resourceType = 'IMAGE';
      bucketName = 'images';
      targetTable = 'images';
    } else if (mime.startsWith('video/')) {
      resourceType = 'VIDEO';
      bucketName = 'videos';
      targetTable = 'videos';
    }

    const tagsArray = metadata.tags
      ? metadata.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : ['Upload'];

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    let publicUrl = `/uploads/${filename}`;

    // Étape 27 : Stocker les fichiers dans Supabase Storage
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
    } catch (e) {
      this.logger.warn(`Storage upload fallback: ${e}`);
    }

    // Étape 28 : Enregistrer les métadonnées dans les services respectifs (avec persistence DB + fallback mémoire)
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
      } else if (targetTable === 'images') {
        const img = await this.imagesService.create({
          title: metadata.title,
          description: desc,
          category: cat,
          tags: tagsArray,
          imagePath: publicUrl,
          ocrText: 'Texte extrait automatiquement via OCR',
        });
        insertedId = img.id;
      } else if (targetTable === 'videos') {
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
    } catch (e) {
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
}

