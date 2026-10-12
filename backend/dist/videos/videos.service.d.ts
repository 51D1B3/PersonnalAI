import { SupabaseService } from '../supabase/supabase.service.js';
export interface VideoItem {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    type: string;
    date: string;
    videoPath?: string;
    transcript?: string;
}
export declare class VideosService {
    private readonly supabaseService;
    private readonly logger;
    private mockVideos;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<VideoItem[]>;
    searchVideos(query: string): Promise<VideoItem[]>;
    create(body: any): Promise<VideoItem>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
