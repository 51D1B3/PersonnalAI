import { CreateDocumentDto } from './dto/create-document.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export interface DocumentItem {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    type: string;
    date: string;
    filePath?: string;
    contentText?: string;
}
export declare class DocumentsService {
    private readonly supabaseService;
    private readonly logger;
    private mockDocuments;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<DocumentItem[]>;
    create(createDocumentDto: CreateDocumentDto): Promise<DocumentItem>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
