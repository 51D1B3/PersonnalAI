import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller.js';
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { AiModule } from '../ai/ai.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [SupabaseModule, AiModule, SecurityModule],
  controllers: [ImagesController],
  providers: [ImagesService, OcrService],
  exports: [ImagesService, OcrService],
})
export class ImagesModule {}
