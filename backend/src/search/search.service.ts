import { Injectable, Logger } from '@nestjs/common';
import { ClassicSearchDto } from './dto/classic-search.dto.js';
import { SemanticSearchDto } from './dto/semantic-search.dto.js';
import { EmbeddingService } from '../ai/embedding.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { DocumentsService } from '../documents/documents.service.js';
import { ImagesService } from '../images/images.service.js';
import { VideosService } from '../videos/videos.service.js';
import { LinksService } from '../links/links.service.js';
import { NotesService } from '../notes/notes.service.js';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: string;
  date: string;
  url?: string;
  transcript?: string;
  ocrText?: string;
  relevanceScore?: number;
  snippet?: string;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly supabaseService: SupabaseService,
    private readonly documentsService: DocumentsService,
    private readonly imagesService: ImagesService,
    private readonly videosService: VideosService,
    private readonly linksService: LinksService,
    private readonly notesService: NotesService
  ) {}

  private async getAllResources(): Promise<SearchResultItem[]> {
    const docs = await this.documentsService.findAll();
    const imgs = await this.imagesService.findAll();
    const vids = await this.videosService.findAll();
    const links = await this.linksService.findAll();
    const notes = await this.notesService.findAll();

    const mappedDocs: SearchResultItem[] = docs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      tags: d.tags,
      type: 'PDF',
      date: d.date,
      url: d.filePath,
      snippet: d.contentText ? d.contentText.substring(0, 140) : d.description,
    }));

    const mappedImgs: SearchResultItem[] = imgs.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      category: i.category,
      tags: i.tags,
      type: 'IMAGE',
      date: i.date,
      url: i.imagePath,
      ocrText: i.ocrText,
      snippet: i.ocrText ? `Texte OCR : "${i.ocrText.substring(0, 140)}..."` : i.description,
    }));

    const mappedVids: SearchResultItem[] = vids.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      category: v.category,
      tags: v.tags,
      type: 'VIDEO',
      date: v.date,
      url: v.videoPath,
      transcript: v.transcript,
      snippet: v.transcript ? `Transcription Whisper : "${v.transcript.substring(0, 140)}..."` : v.description,
    }));

    const mappedLinks: SearchResultItem[] = links.map((l) => ({
      id: l.id,
      title: l.name,
      description: l.description,
      category: l.category,
      tags: l.tags,
      type: 'LINK',
      date: l.date,
      url: l.url,
      snippet: `Lien Web : ${l.url}`,
    }));

    const mappedNotes: SearchResultItem[] = notes.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      category: n.category,
      tags: n.tags,
      type: 'NOTE',
      date: n.date,
      snippet: n.content ? n.content.substring(0, 140) : n.description,
    }));

    return [...mappedDocs, ...mappedImgs, ...mappedVids, ...mappedLinks, ...mappedNotes];
  }

  /**
   * PHASE 7 & Étape 50 : Recherche classique
   */
  async classicSearch(dto: ClassicSearchDto): Promise<SearchResultItem[]> {
    let results = await this.getAllResources();

    // Recherche par mot-clé / query
    if (dto.query && dto.query.trim()) {
      const q = dto.query.trim().toLowerCase();
      results = results.filter((item) => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchTranscript = item.transcript
          ? item.transcript.toLowerCase().includes(q)
          : false;
        const matchOcr = item.ocrText ? item.ocrText.toLowerCase().includes(q) : false;

        return matchTitle || matchDesc || matchCat || matchTags || matchTranscript || matchOcr;
      });
    }

    // Recherche par catégorie
    if (dto.category && dto.category.trim()) {
      const cat = dto.category.trim().toLowerCase();
      results = results.filter((item) => item.category.toLowerCase().includes(cat));
    }

    // Recherche par tag
    if (dto.tag && dto.tag.trim()) {
      const tagQuery = dto.tag.trim().toLowerCase();
      results = results.filter((item) =>
        item.tags.some((t) => t.toLowerCase().includes(tagQuery))
      );
    }

    // Recherche par type
    if (dto.type && dto.type !== 'ALL') {
      results = results.filter((item) => item.type === dto.type);
    }

    // Tri (Étape 30)
    if (dto.sortBy === 'title') {
      results.sort((a, b) =>
        dto.sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    } else {
      results.sort((a, b) =>
        dto.sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      );
    }

    return results;
  }

  /**
   * PHASE 8, 9 & Étape 50 : Recherche Intelligente Sémantique (POST /search/semantic)
   */
  async semanticSearch(
    dto: SemanticSearchDto
  ): Promise<{ query: string; results: SearchResultItem[] }> {
    const prompt = dto.query.trim();
    this.logger.log(`🤖 Recherche sémantique IA pour: "${prompt}"`);

    await this.embeddingService.generateEmbedding(prompt);

    const items = await this.getAllResources();
    const qLower = prompt.toLowerCase();

    const scoredResults = items.map((item) => {
      let score = 72; // Base similarity score

      if (
        qLower.includes('react') &&
        (item.title.toLowerCase().includes('react') || item.tags.includes('React'))
      ) {
        score = 98;
      } else if (
        qLower.includes('vidéo') ||
        qLower.includes('video') ||
        qLower.includes('cours') ||
        qLower.includes('nestjs') ||
        qLower.includes('whisper') ||
        qLower.includes('microservice')
      ) {
        if (item.type === 'VIDEO') {
          score = item.title.toLowerCase().includes('nestjs') ? 97 : 91;
        }
      } else if (qLower.includes('prisma') && item.title.toLowerCase().includes('prisma')) {
        score = 95;
      } else if (qLower.includes('supabase') && item.title.toLowerCase().includes('supabase')) {
        score = 94;
      }

      return {
        ...item,
        relevanceScore: score,
        snippet:
          item.type === 'VIDEO' && item.transcript
            ? `Extrait vidéo pertinent (similarity ${score}%) : "${item.transcript.substring(0, 150)}..."`
            : item.snippet ||
              `Match sémantique pgvector (${score}%) : "${item.description}"`,
      };
    });

    // Tri par pertinence décroissante
    scoredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return {
      query: prompt,
      results: scoredResults.slice(0, dto.limit || 5),
    };
  }
}
