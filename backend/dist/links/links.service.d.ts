import { CreateLinkDto } from './dto/create-link.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export interface LinkItem {
    id: string;
    name: string;
    url: string;
    description: string;
    category: string;
    tags: string[];
    type: string;
    date: string;
}
export declare class LinksService {
    private readonly supabaseService;
    private readonly logger;
    private mockLinks;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<LinkItem[]>;
    create(createLinkDto: CreateLinkDto): Promise<LinkItem>;
}
