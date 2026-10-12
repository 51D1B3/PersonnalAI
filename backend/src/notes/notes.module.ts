import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [SupabaseModule, SecurityModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
