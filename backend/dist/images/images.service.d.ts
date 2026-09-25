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
export declare class ImagesService {
    private readonly supabaseService;
    private readonly logger;
    private mockImages;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<ImageItem[]>;
    create(createImageDto: CreateImageDto): Promise<ImageItem>;
}
