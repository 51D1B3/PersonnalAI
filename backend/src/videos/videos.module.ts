import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { AiModule } from '../ai/ai.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [SupabaseModule, AiModule, SecurityModule],
  controllers: [VideosController],
  providers: [VideosService, WhisperService],
  exports: [VideosService, WhisperService],
})
export class VideosModule {}
