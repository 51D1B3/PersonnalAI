import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SupabaseModule } from './supabase/supabase.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { ImagesModule } from './images/images.module.js';
import { LinksModule } from './links/links.module.js';
import { NotesModule } from './notes/notes.module.js';
import { VectorModule } from './vector/vector.module.js';
import { UploadModule } from './upload/upload.module.js';
import { AiModule } from './ai/ai.module.js';
import { SearchModule } from './search/search.module.js';
import { VideosModule } from './videos/videos.module.js';
import { SecurityModule } from './security/security.module.js';
import { RateLimitGuard } from './security/rate-limit.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    SecurityModule,
    AuthModule,
    DocumentsModule,
    ImagesModule,
    VideosModule,
    LinksModule,
    NotesModule,
    VectorModule,
    UploadModule,
    AiModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
