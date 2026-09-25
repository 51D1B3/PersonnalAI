import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findAll(): Promise<import("./documents.service.js").DocumentItem[]>;
    create(createDocumentDto: CreateDocumentDto): Promise<import("./documents.service.js").DocumentItem>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
