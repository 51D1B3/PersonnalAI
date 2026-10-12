import { PipeTransform } from '@nestjs/common';
import 'multer';
export declare class FileValidationPipe implements PipeTransform {
    private readonly logger;
    private readonly ALLOWED_EXTENSIONS;
    private readonly FORBIDDEN_EXTENSIONS;
    private readonly ALLOWED_MIME_TYPES;
    private readonly MAX_SIZE_VIDEO;
    private readonly MAX_SIZE_PDF;
    private readonly MAX_SIZE_IMAGE;
    private readonly MAX_SIZE_TEXT;
    transform(file: Express.Multer.File): Express.Multer.File;
    private validateMagicBytes;
}
