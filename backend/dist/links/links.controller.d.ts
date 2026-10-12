import type { Request } from 'express';
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
export declare class LinksController {
    private readonly linksService;
    private readonly logsService;
    constructor(linksService: LinksService, logsService: SecurityLogsService);
    findAll(): Promise<import("./links.service.js").LinkItem[]>;
    create(createLinkDto: CreateLinkDto, email?: string, req?: Request): Promise<import("./links.service.js").LinkItem>;
    remove(id: string, email?: string, req?: Request): Promise<{
        success: boolean;
        id: string;
    }>;
}
