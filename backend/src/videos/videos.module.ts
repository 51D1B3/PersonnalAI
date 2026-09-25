import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [SupabaseModule, AiModule],
  controllers: [VideosController],
  providers: [VideosService, WhisperService],
  exports: [VideosService, WhisperService],
})
export class VideosModule {}
