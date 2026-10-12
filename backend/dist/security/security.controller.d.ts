import type { Request } from 'express';
import { SecurityLogsService } from './security-logs.service.js';
import { TwoFactorService } from './two-factor.service.js';
import { EncryptionService, EncryptedVaultData } from './encryption.service.js';
export declare class Code2FaDto {
    code: string;
}
export declare class EncryptTextDto {
    text: string;
}
export declare class SecurityController {
    private readonly logsService;
    private readonly twoFactorService;
    private readonly encryptionService;
    constructor(logsService: SecurityLogsService, twoFactorService: TwoFactorService, encryptionService: EncryptionService);
    getConnectionLogs(): Promise<import("./security-logs.service.js").ConnectionLogEntry[]>;
    getAuditLogs(): Promise<import("./security-logs.service.js").AuditLogEntry[]>;
    generate2FASecret(email?: string): Promise<import("./two-factor.service.js").TwoFactorSetupResponse>;
    verify2FACode(dto: Code2FaDto, email?: string): Promise<{
        valid: boolean;
        message: string;
    }>;
    enable2FA(dto: Code2FaDto, email?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    disable2FA(dto: Code2FaDto, email?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    get2FAStatus(email?: string): Promise<{
        enabled: boolean;
        secretConfigured: boolean;
    }>;
    encryptSensitiveData(dto: EncryptTextDto, email?: string, req?: Request): Promise<EncryptedVaultData>;
    decryptSensitiveData(data: EncryptedVaultData, email?: string, req?: Request): Promise<{
        decryptedText: string;
    }>;
}
