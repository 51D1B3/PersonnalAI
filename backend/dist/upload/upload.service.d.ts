import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
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
export declare class UploadService {
    private readonly supabaseService;
    private readonly logger;
    private readonly ALLOWED_MIME_TYPES;
    constructor(supabaseService: SupabaseService);
    processUpload(file: Express.Multer.File, metadata: UploadMetadataDto): Promise<UploadResult>;
}
