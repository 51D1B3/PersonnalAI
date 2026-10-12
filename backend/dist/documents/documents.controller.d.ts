import type { Request } from 'express';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
export declare class DocumentsController {
    private readonly documentsService;
    private readonly logsService;
    constructor(documentsService: DocumentsService, logsService: SecurityLogsService);
    findAll(): Promise<import("./documents.service.js").DocumentItem[]>;
    downloadDocument(id: string, email?: string, req?: Request): Promise<{
        downloadUrl: string | undefined;
        success: boolean;
        message: string;
    }>;
    create(createDocumentDto: CreateDocumentDto, email?: string, req?: Request): Promise<import("./documents.service.js").DocumentItem>;
    remove(id: string, email?: string, req?: Request): Promise<{
        success: boolean;
        id: string;
    }>;
}
