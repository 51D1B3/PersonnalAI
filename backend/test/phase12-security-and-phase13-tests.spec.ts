import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from '../src/auth/auth.service.js';
import { SecurityLogsService } from '../src/security/security-logs.service.js';
import { TwoFactorService } from '../src/security/two-factor.service.js';
import { EncryptionService } from '../src/security/encryption.service.js';
import { FileValidationPipe } from '../src/security/file-validation.pipe.js';
import { RateLimitGuard } from '../src/security/rate-limit.guard.js';
import { SearchService } from '../src/search/search.service.js';
import { VideosService } from '../src/videos/videos.service.js';
import { DocumentsService } from '../src/documents/documents.service.js';
import { SupabaseService } from '../src/supabase/supabase.service.js';
import { EmbeddingService } from '../src/ai/embedding.service.js';

describe('PHASE 12 & 13 — Tests de Sécurité Avancée et Fonctionnalités PersonalAI', () => {
  let authService: AuthService;
  let securityLogsService: SecurityLogsService;
  let twoFactorService: TwoFactorService;
  let encryptionService: EncryptionService;
  let fileValidationPipe: FileValidationPipe;
  let searchService: SearchService;
  let videosService: VideosService;
  let documentsService: DocumentsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        SecurityLogsService,
        TwoFactorService,
        EncryptionService,
        FileValidationPipe,
        SearchService,
        VideosService,
        DocumentsService,
        EmbeddingService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: () => ({
              auth: {
                signInWithPassword: async () => ({ data: { user: { id: 'usr-1' } }, error: null }),
                signOut: async () => ({ error: null }),
              },
              from: () => ({
                select: () => ({ data: [], error: null }),
                insert: () => ({ select: () => ({ single: () => ({ data: { id: '1' }, error: null }) }) }),
                delete: () => ({ eq: () => ({ data: [], error: null }) }),
              }),
            }),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    securityLogsService = moduleRef.get<SecurityLogsService>(SecurityLogsService);
    twoFactorService = moduleRef.get<TwoFactorService>(TwoFactorService);
    encryptionService = moduleRef.get<EncryptionService>(EncryptionService);
    fileValidationPipe = moduleRef.get<FileValidationPipe>(FileValidationPipe);
    searchService = moduleRef.get<SearchService>(SearchService);
    videosService = moduleRef.get<VideosService>(VideosService);
    documentsService = moduleRef.get<DocumentsService>(DocumentsService);
  });

  // 1. TEST CONNEXION & PERMISSIONS (Compte Autorisé vs Non Autorisé)
  describe('1. Connexion & Permissions (Comptes autorisés vs non autorisés)', () => {
    it('Compte autorisé (mahamadousidibe2004@gmail.com) → ✅ Doit réussir la connexion', async () => {
      const res = await authService.login({
        email: 'mahamadousidibe2004@gmail.com',
        password: 'password123',
      });

      expect(res).toBeDefined();
      expect(res.user.email).toBe('mahamadousidibe2004@gmail.com');
      expect(res.user.isAuthorized).toBe(true);
      expect(res.token).toBeDefined();
    });

    it('Compte autorisé (mahamadousidibe2104@gmail.com) → ✅ Doit réussir la connexion', async () => {
      const res = await authService.login({
        email: 'mahamadousidibe2104@gmail.com',
        password: 'adminpassword',
      });

      expect(res.user.isAuthorized).toBe(true);
    });

    it('Compte non autorisé (hacker@bad.com) → ❌ Refusé (UnauthorizedException)', async () => {
      await expect(
        authService.login({
          email: 'hacker@bad.com',
          password: 'anyPassword',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // 2. TEST DÉCONNEXION
  describe('2. Déconnexion', () => {
    it('Déconnexion → ✅ Retourne succès et ferme la session', async () => {
      const res = await authService.logout('sample-token', 'mahamadousidibe2004@gmail.com');
      expect(res.success).toBe(true);
      expect(res.message).toContain('Déconnexion réussie');
    });
  });

  // 3. TEST UPLOAD & VALIDATION STRICTE (Étape 52)
  describe('3. Upload & Validation stricte des fichiers (Étape 52)', () => {
    it('Fichier PDF valide → ✅ Doit passer la validation', () => {
      const validPdfFile: any = {
        originalname: 'react_hooks.pdf',
        mimetype: 'application/pdf',
        size: 1024 * 500, // 500 KB
        buffer: Buffer.from('%PDF-1.4 sample content'),
      };

      const result = fileValidationPipe.transform(validPdfFile);
      expect(result).toBe(validPdfFile);
    });

    it('Fichier Image PNG valide → ✅ Doit passer la validation', () => {
      const validPngFile: any = {
        originalname: 'screenshot.png',
        mimetype: 'image/png',
        size: 1024 * 200,
        buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      };

      const result = fileValidationPipe.transform(validPngFile);
      expect(result).toBe(validPngFile);
    });

    it('Fichier Exécutable (.exe / .sh) → ❌ Rejeté immédiatement pour sécurité', () => {
      const dangerousFile: any = {
        originalname: 'malware.exe',
        mimetype: 'application/octet-stream',
        size: 1024,
        buffer: Buffer.from('MZ...'),
      };

      expect(() => fileValidationPipe.transform(dangerousFile)).toThrow(BadRequestException);
    });
  });

  // 4. TEST SUPPRESSION & TÉLÉCHARGEMENT (Étape 55 Audit Log)
  describe('4. Audit logs pour suppressions et téléchargements (Étape 55)', () => {
    it('Enregistre un journal d\'audit lors d\'une suppression', async () => {
      const log = await securityLogsService.logAudit(
        'mahamadousidibe2004@gmail.com',
        'DELETE',
        'PDF',
        'doc-99',
        'Document Test'
      );

      expect(log.action).toBe('DELETE');
      expect(log.resourceTitle).toBe('Document Test');

      const logs = await securityLogsService.getAuditLogs();
      expect(logs.some((l) => l.action === 'DELETE')).toBe(true);
    });

    it('Enregistre un journal d\'audit lors d\'un téléchargement', async () => {
      const log = await securityLogsService.logAudit(
        'mahamadousidibe2004@gmail.com',
        'DOWNLOAD',
        'PDF',
        'doc-100',
        'React Masterclass'
      );

      expect(log.action).toBe('DOWNLOAD');

      const logs = await securityLogsService.getAuditLogs();
      expect(logs.some((l) => l.action === 'DOWNLOAD')).toBe(true);
    });
  });

  // 5. TEST RECHERCHE DANS LES VIDÉOS & WHISPER (Étape 50)
  describe('5. Recherche dans les vidéos & transcriptions Whisper (Étape 50)', () => {
    it('Recherche vidéo par transcript Whisper → ✅ Doit retourner la vidéo correspondante', async () => {
      const results = await videosService.searchVideos('microservices');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('NestJS');
      expect(results[0].transcript).toContain('NestJS');
    });

    it('Recherche classique intégrant les vidéos (Étape 50)', async () => {
      const results = await searchService.classicSearch({ query: 'NestJS' });
      expect(results.some((r) => r.type === 'VIDEO')).toBe(true);
    });
  });

  // 6. TEST RECHERCHE CLASSIC, IA ET OCR
  describe('6. Recherche Classique, IA & OCR', () => {
    it('Recherche classique par mot-clé React → ✅', async () => {
      const results = await searchService.classicSearch({ query: 'React' });
      expect(results.length).toBeGreaterThan(0);
    });

    it('Recherche IA Sémantique → ✅ Retourne un score de pertinence', async () => {
      const res = await searchService.semanticSearch({ query: 'cours sur les hooks React' });
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results[0].relevanceScore).toBeGreaterThanOrEqual(90);
    });

    it('Recherche OCR dans les captures d\'écran → ✅', async () => {
      const results = await searchService.classicSearch({ query: 'Prisma' });
      expect(results.some((r) => r.ocrText?.includes('Prisma') || r.description.includes('Prisma'))).toBe(true);
    });
  });

  // 7. TEST 2FA & CHIFFREMENT (Étape 56 & 57)
  describe('7. Sécurité : 2FA (Étape 56) & Chiffrement des infos sensibles (Étape 57)', () => {
    it('2FA : Génération de secret et validation de code (Étape 56)', async () => {
      const setup = await twoFactorService.generateSecret('mahamadousidibe2004@gmail.com');
      expect(setup.secret).toBeDefined();
      expect(setup.otpauthUrl).toContain('mahamadousidibe2004%40gmail.com');

      const isValid = await twoFactorService.verifyCode('mahamadousidibe2004@gmail.com', '123456');
      expect(isValid).toBe(true);
    });

    it('Chiffrement AES-256-GCM : Chiffre et déchiffre une information très sensible (Étape 57)', () => {
      const sensitiveSecret = 'SECRET_DB_PASSWORD_PROD_2026_AES_KEY';
      const encrypted = encryptionService.encrypt(sensitiveSecret);

      expect(encrypted.cipherText).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.authTag).toBeDefined();
      expect(encrypted.cipherText).not.toBe(sensitiveSecret);

      const decrypted = encryptionService.decrypt(encrypted);
      expect(decrypted).toBe(sensitiveSecret);
    });
  });

  // 8. TEST JOURNAL DES CONNEXIONS (Étape 54)
  describe('8. Journal des connexions (Étape 54)', () => {
    it('Journalise une tentative de connexion réussie et un échec', async () => {
      await securityLogsService.logConnection('mahamadousidibe2004@gmail.com', 'SUCCESS', '127.0.0.1');
      await securityLogsService.logConnection('intruder@bad.com', 'FAILED_UNAUTHORIZED_EMAIL', '192.168.1.5');

      const logs = await securityLogsService.getConnectionLogs();
      expect(logs.length).toBeGreaterThanOrEqual(2);
      expect(logs.some((l) => l.email === 'intruder@bad.com' && l.status === 'FAILED_UNAUTHORIZED_EMAIL')).toBe(true);
    });
  });
});
