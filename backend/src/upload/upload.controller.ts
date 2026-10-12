import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UploadService } from './upload.service.js';
import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { FileValidationPipe } from '../security/file-validation.pipe.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import 'multer';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly logsService: SecurityLogsService
  ) {}

  // Étape 52 & 55 : Upload avec validation stricte du fichier et journal audit
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() metadata: UploadMetadataDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const result = await this.uploadService.processUpload(file, metadata);

    // Étape 55 : Journal audit des uploads
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'UPLOAD',
      result.type,
      result.id,
      result.title,
      `Fichier [${file.originalname}] uploadé et validé (${result.fileSize} bytes)`,
      ip
    );

    return result;
  }
}
