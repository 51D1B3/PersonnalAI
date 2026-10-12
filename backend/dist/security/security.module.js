var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SecurityLogsService } from './security-logs.service.js';
import { TwoFactorService } from './two-factor.service.js';
import { EncryptionService } from './encryption.service.js';
import { RateLimitGuard } from './rate-limit.guard.js';
import { FileValidationPipe } from './file-validation.pipe.js';
import { SecurityController } from './security.controller.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
let SecurityModule = class SecurityModule {
};
SecurityModule = __decorate([
    Module({
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
], SecurityModule);
export { SecurityModule };
//# sourceMappingURL=security.module.js.map