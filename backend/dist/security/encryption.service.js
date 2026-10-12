var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EncryptionService_1;
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
export class EncryptedVaultData {
    cipherText;
    iv;
    authTag;
}
let EncryptionService = EncryptionService_1 = class EncryptionService {
    logger = new Logger(EncryptionService_1.name);
    algorithm = 'aes-256-gcm';
    getMasterKey() {
        const rawKey = process.env.ENCRYPTION_SECRET_KEY || 'personalai_secure_vault_master_key_2026';
        return crypto.createHash('sha256').update(rawKey).digest();
    }
    encrypt(text) {
        if (!text || text.trim() === '') {
            throw new BadRequestException('❌ Impossible de chiffrer du texte vide.');
        }
        const key = this.getMasterKey();
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        this.logger.log(`🔐 Donnée sensible chiffrée avec succès (AES-256-GCM)`);
        return {
            cipherText: encrypted,
            iv: iv.toString('hex'),
            authTag,
        };
    }
    decrypt(data) {
        if (!data || !data.cipherText || !data.iv || !data.authTag) {
            throw new BadRequestException('❌ Format de données chiffrées invalide (cipherText, iv, authTag requis).');
        }
        try {
            const key = this.getMasterKey();
            const ivBuffer = Buffer.from(data.iv, 'hex');
            const authTagBuffer = Buffer.from(data.authTag, 'hex');
            const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
            decipher.setAuthTag(authTagBuffer);
            let decrypted = decipher.update(data.cipherText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            this.logger.log(`🔓 Donnée sensible déchiffrée avec succès`);
            return decrypted;
        }
        catch (error) {
            this.logger.error(`🚨 Échec du déchiffrement (Clé incorrecte ou altération du contenu): ${error}`);
            throw new BadRequestException('🚨 Erreur de sécurité : Clé de déchiffrement incorrecte ou donnée altérée (Intégrité compromise).');
        }
    }
};
EncryptionService = EncryptionService_1 = __decorate([
    Injectable()
], EncryptionService);
export { EncryptionService };
//# sourceMappingURL=encryption.service.js.map