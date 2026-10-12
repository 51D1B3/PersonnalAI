import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { SecurityModule } from '../security/security.module.js';
import { DocumentsModule } from '../documents/documents.module.js';
import { ImagesModule } from '../images/images.module.js';
import { VideosModule } from '../videos/videos.module.js';

@Module({
  imports: [SupabaseModule, SecurityModule, DocumentsModule, ImagesModule, VideosModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

