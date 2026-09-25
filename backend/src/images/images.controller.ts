import { Controller, Get, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly ocrService: OcrService
  ) {}

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }

  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  // Étape 42, 43, 44, 45, 46: OCR Scan & Embeddings generation for screenshots
  @Post('scan-ocr')
  async scanOcr(@Body() body: { imagePath?: string; title?: string }) {
    const title = body.title || 'Capture Erreur Prisma P1001.png';
    const imagePath = body.imagePath || '/uploads/sample.png';
    return this.ocrService.processImageOcr(imagePath, title);
  }
}
