import { Module } from '@nestjs/common';
import { LinksController } from './links.controller.js';
import { LinksService } from './links.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [SupabaseModule, SecurityModule],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
