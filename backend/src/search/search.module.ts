import { Module } from '@nestjs/common';
import { SearchController } from './search.controller.js';
import { SearchService } from './search.service.js';
import { AiModule } from '../ai/ai.module.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { DocumentsModule } from '../documents/documents.module.js';
import { ImagesModule } from '../images/images.module.js';
import { VideosModule } from '../videos/videos.module.js';
import { LinksModule } from '../links/links.module.js';
import { NotesModule } from '../notes/notes.module.js';

@Module({
  imports: [
    AiModule,
    SupabaseModule,
    DocumentsModule,
    ImagesModule,
    VideosModule,
    LinksModule,
    NotesModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
