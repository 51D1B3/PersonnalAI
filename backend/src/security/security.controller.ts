import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SecurityLogsService } from './security-logs.service.js';
import { TwoFactorService } from './two-factor.service.js';
import { EncryptionService, EncryptedVaultData } from './encryption.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

export class Code2FaDto {
  code!: string;
}

export class EncryptTextDto {
  text!: string;
}

@Controller('security')
@UseGuards(AuthGuard)
export class SecurityController {
  constructor(
    private readonly logsService: SecurityLogsService,
    private readonly twoFactorService: TwoFactorService,
    private readonly encryptionService: EncryptionService
  ) {}

  // Étape 54 : Journal des connexions
  @Get('logs/connections')
  async getConnectionLogs() {
    return this.logsService.getConnectionLogs();
  }

  // Étape 55 : Journal des suppressions / téléchargements / actions
  @Get('logs/audit')
  async getAuditLogs() {
    return this.logsService.getAuditLogs();
  }

  // Étape 56 : Génération secret 2FA
  @Post('2fa/generate')
  @HttpCode(HttpStatus.OK)
  async generate2FASecret(@Headers('x-user-email') email?: string) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    return this.twoFactorService.generateSecret(userEmail);
  }

  // Étape 56 : Vérification d'un code 2FA
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verify2FACode(
    @Body() dto: Code2FaDto,
    @Headers('x-user-email') email?: string
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const valid = await this.twoFactorService.verifyCode(userEmail, dto.code);
    return { valid, message: valid ? 'Code 2FA valide ✅' : 'Code 2FA invalide ❌' };
  }

  // Étape 56 : Activation 2FA
  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  async enable2FA(
    @Body() dto: Code2FaDto,
    @Headers('x-user-email') email?: string
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    return this.twoFactorService.enable2FA(userEmail, dto.code);
  }

  // Étape 56 : Désactivation 2FA
  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disable2FA(
    @Body() dto: Code2FaDto,
    @Headers('x-user-email') email?: string
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    return this.twoFactorService.disable2FA(userEmail, dto.code);
  }

  // Étape 56 : Statut 2FA
  @Get('2fa/status')
  async get2FAStatus(@Headers('x-user-email') email?: string) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    return this.twoFactorService.getStatus(userEmail);
  }

  // Étape 57 : Chiffrement AES-256-GCM d'informations sensibles
  @Post('vault/encrypt')
  @HttpCode(HttpStatus.OK)
  async encryptSensitiveData(
    @Body() dto: EncryptTextDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const result = this.encryptionService.encrypt(dto.text);

    // Audit log
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';
    await this.logsService.logAudit(
      userEmail,
      'SECURITY',
      'VAULT',
      'enc-1',
      'Chiffrement Donnée Sensible',
      'Information chiffrée avec succès en AES-256-GCM',
      ip
    );

    return result;
  }

  // Étape 57 : Déchiffrement AES-256-GCM
  @Post('vault/decrypt')
  @HttpCode(HttpStatus.OK)
  async decryptSensitiveData(
    @Body() data: EncryptedVaultData,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const decryptedText = this.encryptionService.decrypt(data);

    // Audit log
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';
    await this.logsService.logAudit(
      userEmail,
      'SECURITY',
      'VAULT',
      'dec-1',
      'Déchiffrement Donnée Sensible',
      'Information déchiffrée avec succès',
      ip
    );

    return { decryptedText };
  }
}
