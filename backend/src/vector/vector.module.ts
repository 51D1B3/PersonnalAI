import { Module } from '@nestjs/common';
import { VectorService } from './vector.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
