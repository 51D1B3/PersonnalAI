import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('images')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly ocrService: OcrService,
    private readonly logsService: SecurityLogsService
  ) {}

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }

  @Post()
  async create(
    @Body() createImageDto: CreateImageDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const img = await this.imagesService.create(createImageDto);
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'UPLOAD',
      'IMAGE',
      img.id,
      img.title,
      'Image / capture d\'écran enregistrée dans la base de données',
      ip
    );

    return img;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    const result = await this.imagesService.remove(id);
    await this.logsService.logAudit(
      userEmail,
      'DELETE',
      'IMAGE',
      id,
      `Image-${id}`,
      `Suppression de l'image ${id} de la base de données`,
      ip
    );

    return result;
  }

  // Étape 42, 43, 44, 45, 46: OCR Scan & Embeddings generation for screenshots
  @Post('scan-ocr')
  async scanOcr(@Body() body: { imagePath?: string; title?: string }) {
    const title = body.title || 'Capture Erreur Prisma P1001.png';
    const imagePath = body.imagePath || '/uploads/sample.png';
    return this.ocrService.processImageOcr(imagePath, title);
  }
}
