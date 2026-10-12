import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export class EncryptedVaultData {
  cipherText!: string;
  iv!: string;
  authTag!: string;
}

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';

  // Secret key derived from environment or secure salt key
  private getMasterKey(): Buffer {
    const rawKey = process.env.ENCRYPTION_SECRET_KEY || 'personalai_secure_vault_master_key_2026';
    return crypto.createHash('sha256').update(rawKey).digest();
  }

  /**
   * Étape 57 : Chiffrement AES-256-GCM des informations réellement sensibles
   */
  encrypt(text: string): EncryptedVaultData {
    if (!text || text.trim() === '') {
      throw new BadRequestException('❌ Impossible de chiffrer du texte vide.');
    }

    const key = this.getMasterKey();
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
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

  /**
   * Étape 57 : Déchiffrement AES-256-GCM
   */
  decrypt(data: EncryptedVaultData): string {
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
    } catch (error) {
      this.logger.error(`🚨 Échec du déchiffrement (Clé incorrecte ou altération du contenu): ${error}`);
      throw new BadRequestException(
        '🚨 Erreur de sécurité : Clé de déchiffrement incorrecte ou donnée altérée (Intégrité compromise).'
      );
    }
  }
}
