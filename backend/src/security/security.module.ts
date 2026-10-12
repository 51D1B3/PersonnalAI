import { Module } from '@nestjs/common';
import { SecurityLogsService } from './security-logs.service.js';
import { TwoFactorService } from './two-factor.service.js';
import { EncryptionService } from './encryption.service.js';
import { RateLimitGuard } from './rate-limit.guard.js';
import { FileValidationPipe } from './file-validation.pipe.js';
import { SecurityController } from './security.controller.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [SecurityController],
  providers: [
    SecurityLogsService,
    TwoFactorService,
    EncryptionService,
    RateLimitGuard,
    FileValidationPipe,
  ],
  exports: [
    SecurityLogsService,
    TwoFactorService,
    EncryptionService,
    RateLimitGuard,
    FileValidationPipe,
  ],
})
export class SecurityModule {}
