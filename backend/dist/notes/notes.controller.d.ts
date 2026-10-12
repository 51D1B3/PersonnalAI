import type { Request } from 'express';
import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
export declare class NotesController {
    private readonly notesService;
    private readonly logsService;
    constructor(notesService: NotesService, logsService: SecurityLogsService);
    findAll(): Promise<import("./notes.service.js").NoteItem[]>;
    create(createNoteDto: CreateNoteDto, email?: string, req?: Request): Promise<import("./notes.service.js").NoteItem>;
    remove(id: string, email?: string, req?: Request): Promise<{
        success: boolean;
        id: string;
    }>;
}
