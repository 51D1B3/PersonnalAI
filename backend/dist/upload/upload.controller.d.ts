import { UploadService } from './upload.service.js';
import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import 'multer';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File, metadata: UploadMetadataDto): Promise<import("./upload.service.js").UploadResult>;
}
