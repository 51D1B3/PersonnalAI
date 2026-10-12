import type { Request } from 'express';
import { UploadService } from './upload.service.js';
import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import 'multer';
export declare class UploadController {
    private readonly uploadService;
    private readonly logsService;
    constructor(uploadService: UploadService, logsService: SecurityLogsService);
    uploadFile(file: Express.Multer.File, metadata: UploadMetadataDto, email?: string, req?: Request): Promise<import("./upload.service.js").UploadResult>;
}
