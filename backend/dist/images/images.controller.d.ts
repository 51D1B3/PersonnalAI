import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
export declare class ImagesController {
    private readonly imagesService;
    private readonly ocrService;
    constructor(imagesService: ImagesService, ocrService: OcrService);
    findAll(): Promise<import("./images.service.js").ImageItem[]>;
    create(createImageDto: CreateImageDto): Promise<import("./images.service.js").ImageItem>;
    scanOcr(body: {
        imagePath?: string;
        title?: string;
    }): Promise<import("./ocr.service.js").OcrAnalysisResult>;
}
