import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { TwoFactorService } from '../security/two-factor.service.js';

const ALLOWED_EMAILS = [
  { email: 'mahamadousidibe2004@gmail.com', name: 'Sidibé (Propriétaire)', role: 'Propriétaire' },
  { email: 'mahamadousidibe2104@gmail.com', name: 'Sidibé (Co-Propriétaire)', role: 'Co-Propriétaire' },
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly securityLogsService: SecurityLogsService,
    private readonly twoFactorService: TwoFactorService
  ) {}

  async login(loginDto: LoginDto, clientIp: string = '127.0.0.1', userAgent: string = 'Browser') {
    const email = (loginDto.email || '').trim().toLowerCase();

    // 1. Étape 19, 20, 54 : Vérification des comptes autorisés & Journalisation des refus
    const allowed = ALLOWED_EMAILS.find((u) => u.email.toLowerCase() === email);

    if (!allowed) {
      this.logger.warn(`❌ Accès refusé et journalisé pour l'email non autorisé: ${email}`);
      await this.securityLogsService.logConnection(
        email,
        'FAILED_UNAUTHORIZED_EMAIL',
        clientIp,
        userAgent
      );
      throw new UnauthorizedException(
        '❌ Accès refusé : Seules les adresses email prédéfinies propriétaires sont autorisées.'
      );
    }

    // 2. Étape 56 : Vérification de la 2FA si activée
    const twoFactorStatus = this.twoFactorService.getStatus(email);
    if (twoFactorStatus.enabled) {
      const code = (loginDto as any).twoFactorCode;
      if (!code) {
        throw new UnauthorizedException(
          '🔒 Authentification 2FA requise. Veuillez fournir un code à 6 chiffres.'
        );
      }
      const is2faValid = await this.twoFactorService.verifyCode(email, code);
      if (!is2faValid) {
        await this.securityLogsService.logConnection(email, 'FAILED_2FA', clientIp, userAgent);
        throw new UnauthorizedException('🔒 Code 2FA incorrect ou expiré.');
      }
    }

    // 3. Étape 21 : Connexion Supabase / Locale
    const client = this.supabaseService.getClient();
    let supabaseUser: { id: string } | null = null;

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password: loginDto.password,
      });

      if (!error && data.user) {
        supabaseUser = data.user;
      }
    } catch {
      this.logger.log(`Info: Session locale générée pour ${email}`);
    }

    // 4. Étape 54 : Enregistrement du log de connexion réussie
    await this.securityLogsService.logConnection(email, 'SUCCESS', clientIp, userAgent);

    const token = `pai_sec_token_${Buffer.from(email).toString('base64')}`;

    return {
      message: 'Connexion réussie sur PersonalAI ✅',
      user: {
        email: allowed.email,
        name: allowed.name,
        role: allowed.role,
        isAuthorized: true,
        id: supabaseUser?.id || 'usr_local_sidibe',
        twoFactorEnabled: twoFactorStatus.enabled,
      },
      token,
    };
  }

  // Étape 22 : Déconnexion
  async logout(token?: string, email?: string) {
    try {
      const client = this.supabaseService.getClient();
      await client.auth.signOut();
    } catch {
      // ignore
    }
    this.logger.log(`Déconnexion effectuée pour ${email || 'utilisateur'}`);
    return { success: true, message: 'Déconnexion réussie.' };
  }

  // Étape 23 : Protection des routes / Profil
  async getProfile(email?: string) {
    if (!email) {
      throw new UnauthorizedException('Session non valide');
    }
    const cleanEmail = email.trim().toLowerCase();
    const allowed = ALLOWED_EMAILS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!allowed) {
      throw new UnauthorizedException('Compte non autorisé.');
    }

    const twoFactorStatus = this.twoFactorService.getStatus(cleanEmail);

    return {
      email: allowed.email,
      name: allowed.name,
      role: allowed.role,
      isAuthorized: true,
      twoFactorEnabled: twoFactorStatus.enabled,
    };
  }

  // Étape 11 : Gardien backend - Vérification de l'identité et de l'email via Supabase getUser(token)
  async verifyUser(
    authorization?: string,
    clientIp: string = '127.0.0.1',
    userAgent: string = 'Browser'
  ) {
    if (!authorization) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authorization.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token invalide');
    }

    const {
      data: { user },
      error,
    } = await this.supabaseService.getClient().auth.getUser(token);

    if (error || !user) {
      this.logger.warn(`Tentative d'accès avec un token Supabase invalide ou expiré`);
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const email = user.email?.toLowerCase().trim();

    // Récupération des emails autorisés depuis les variables d'environnement
    const envAllowed = [
      process.env.ALLOWED_EMAIL_1?.toLowerCase().trim(),
      process.env.ALLOWED_EMAIL_2?.toLowerCase().trim(),
    ].filter(Boolean) as string[];

    if (process.env.ALLOWED_EMAILS) {
      process.env.ALLOWED_EMAILS.split(',')
        .map((e) => e.toLowerCase().trim())
        .forEach((e) => {
          if (e && !envAllowed.includes(e)) envAllowed.push(e);
        });
    }

    // Fallback par défaut si non définis
    if (envAllowed.length === 0) {
      ALLOWED_EMAILS.forEach((item) => envAllowed.push(item.email.toLowerCase()));
    }

    if (!email || !envAllowed.includes(email)) {
      this.logger.warn(`❌ Accès refusé par le backend pour l'email Google non autorisé: ${email}`);
      await this.securityLogsService.logConnection(
        email || 'inconnu',
        'FAILED_UNAUTHORIZED_EMAIL',
        clientIp,
        userAgent
      );
      throw new UnauthorizedException("Cet email n'est pas autorisé à accéder à PersonalAI.");
    }

    // Succès : log de sécurité
    await this.securityLogsService.logConnection(email, 'SUCCESS', clientIp, userAgent);
    this.logger.log(`✅ Accès autorisé par le backend pour: ${email}`);

    // Formater les informations utilisateur
    const matchingAllowed = ALLOWED_EMAILS.find((u) => u.email.toLowerCase() === email);
    const userName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      matchingAllowed?.name ||
      email.split('@')[0];

    const userRole = matchingAllowed?.role || 'Propriétaire';

    return {
      success: true,
      message: 'Accès autorisé',
      user: {
        id: user.id,
        email: user.email,
        name: userName,
        role: userRole,
        isAuthorized: true,
      },
    };
  }
}

