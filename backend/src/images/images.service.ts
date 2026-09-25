import { Injectable, Logger } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

export interface ImageItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
  imagePath?: string;
  ocrText?: string;
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  private mockImages: ImageItem[] = [
    {
      id: 'img-1',
      title: 'Capture Erreur Prisma P1001.png',
      description: 'Capture d\'écran de l\'erreur de connexion à la base de données avec solution alternative.',
      category: 'Backend / Database',
      tags: ['Prisma', 'Bug', 'PostgreSQL'],
      type: 'IMAGE',
      ocrText: 'Prisma P1001: Can\'t reach database server at localhost:5432',
      date: '22 Septembre 2026',
    }
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<ImageItem[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('images').select('*');

      if (!error && data && data.length > 0) {
        return data.map((img: any) => ({
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
    } catch (e) {
      this.logger.warn(`Erreur lecture images Supabase: ${e}`);
    }

    return this.mockImages;
  }

  async create(createImageDto: CreateImageDto): Promise<ImageItem> {
    const newImg: ImageItem = {
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
    } catch (e) {
      this.logger.warn(`Erreur insertion image Supabase: ${e}`);
    }

    this.mockImages.unshift(newImg);
    return newImg;
  }
}
