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
export declare class SearchService {
    private readonly embeddingService;
    private readonly supabaseService;
    private readonly documentsService;
    private readonly imagesService;
    private readonly videosService;
    private readonly linksService;
    private readonly notesService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, supabaseService: SupabaseService, documentsService: DocumentsService, imagesService: ImagesService, videosService: VideosService, linksService: LinksService, notesService: NotesService);
    private getAllResources;
    classicSearch(dto: ClassicSearchDto): Promise<SearchResultItem[]>;
    semanticSearch(dto: SemanticSearchDto): Promise<{
        query: string;
        results: SearchResultItem[];
    }>;
}
