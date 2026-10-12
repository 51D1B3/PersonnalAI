import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [SupabaseModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

