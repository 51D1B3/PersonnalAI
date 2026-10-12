var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Headers, HttpCode, HttpStatus, UseGuards, Req, } from '@nestjs/common';
import { SecurityLogsService } from './security-logs.service.js';
import { TwoFactorService } from './two-factor.service.js';
import { EncryptionService, EncryptedVaultData } from './encryption.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
export class Code2FaDto {
    code;
}
export class EncryptTextDto {
    text;
}
let SecurityController = class SecurityController {
    logsService;
    twoFactorService;
    encryptionService;
    constructor(logsService, twoFactorService, encryptionService) {
        this.logsService = logsService;
        this.twoFactorService = twoFactorService;
        this.encryptionService = encryptionService;
    }
    async getConnectionLogs() {
        return this.logsService.getConnectionLogs();
    }
    async getAuditLogs() {
        return this.logsService.getAuditLogs();
    }
    async generate2FASecret(email) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        return this.twoFactorService.generateSecret(userEmail);
    }
    async verify2FACode(dto, email) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const valid = await this.twoFactorService.verifyCode(userEmail, dto.code);
        return { valid, message: valid ? 'Code 2FA valide ✅' : 'Code 2FA invalide ❌' };
    }
    async enable2FA(dto, email) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        return this.twoFactorService.enable2FA(userEmail, dto.code);
    }
    async disable2FA(dto, email) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        return this.twoFactorService.disable2FA(userEmail, dto.code);
    }
    async get2FAStatus(email) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        return this.twoFactorService.getStatus(userEmail);
    }
    async encryptSensitiveData(dto, email, req) {
        const result = this.encryptionService.encrypt(dto.text);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'SECURITY', 'VAULT', 'enc-1', 'Chiffrement Donnée Sensible', 'Information chiffrée avec succès en AES-256-GCM', ip);
        return result;
    }
    async decryptSensitiveData(data, email, req) {
        const decryptedText = this.encryptionService.decrypt(data);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'SECURITY', 'VAULT', 'dec-1', 'Déchiffrement Donnée Sensible', 'Information déchiffrée avec succès', ip);
        return { decryptedText };
    }
};
__decorate([
    Get('logs/connections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getConnectionLogs", null);
__decorate([
    Get('logs/audit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getAuditLogs", null);
__decorate([
    Post('2fa/generate'),
    HttpCode(HttpStatus.OK),
    __param(0, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "generate2FASecret", null);
__decorate([
    Post('2fa/verify'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Code2FaDto, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "verify2FACode", null);
__decorate([
    Post('2fa/enable'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Code2FaDto, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "enable2FA", null);
__decorate([
    Post('2fa/disable'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Code2FaDto, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "disable2FA", null);
__decorate([
    Get('2fa/status'),
    __param(0, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "get2FAStatus", null);
__decorate([
    Post('vault/encrypt'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EncryptTextDto, String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "encryptSensitiveData", null);
__decorate([
    Post('vault/decrypt'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EncryptedVaultData, String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "decryptSensitiveData", null);
SecurityController = __decorate([
    Controller('security'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [SecurityLogsService,
        TwoFactorService,
        EncryptionService])
], SecurityController);
export { SecurityController };
//# sourceMappingURL=security.controller.js.map