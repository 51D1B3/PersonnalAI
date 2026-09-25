import { Module } from '@nestjs/common';
import { SearchController } from './search.controller.js';
import { SearchService } from './search.service.js';
import { AiModule } from '../ai/ai.module.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [AiModule, SupabaseModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
