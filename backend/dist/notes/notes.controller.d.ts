import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    findAll(): Promise<import("./notes.service.js").NoteItem[]>;
    create(createNoteDto: CreateNoteDto): Promise<import("./notes.service.js").NoteItem>;
}
