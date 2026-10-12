import type { Request } from 'express';
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
export declare class ImagesController {
    private readonly imagesService;
    private readonly ocrService;
    private readonly logsService;
    constructor(imagesService: ImagesService, ocrService: OcrService, logsService: SecurityLogsService);
    findAll(): Promise<import("./images.service.js").ImageItem[]>;
    create(createImageDto: CreateImageDto, email?: string, req?: Request): Promise<import("./images.service.js").ImageItem>;
    remove(id: string, email?: string, req?: Request): Promise<{
        success: boolean;
        id: string;
    }>;
    scanOcr(body: {
        imagePath?: string;
        title?: string;
    }): Promise<import("./ocr.service.js").OcrAnalysisResult>;
}
