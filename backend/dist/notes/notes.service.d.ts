import { CreateNoteDto } from './dto/create-note.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export interface NoteItem {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    type: string;
    isVault: boolean;
    date: string;
}
export declare class NotesService {
    private readonly supabaseService;
    private readonly logger;
    private mockNotes;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<NoteItem[]>;
    create(createNoteDto: CreateNoteDto): Promise<NoteItem>;
}
