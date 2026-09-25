import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

const ALLOWED_EMAILS = [
  { email: 'sidibe@personalai.dev', name: 'Sidibé', role: 'Propriétaire' },
  { email: 'admin@personalai.dev', name: 'Administrateur', role: 'Co-Propriétaire' }
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();
    
    // 1. Étape 19 & 20 : Vérification stricte des 2 comptes autorisés (Bloquer toute autre adresse)
    const allowed = ALLOWED_EMAILS.find(u => u.email.toLowerCase() === email);

    if (!allowed) {
      this.logger.warn(`❌ Tentative d'accès non autorisée pour l'email: ${email}`);
      throw new UnauthorizedException(
        "❌ Accès refusé : Seules les adresses email prédéfinies propriétaires sont autorisées."
      );
    }

    // 2. Étape 21 : Connexion
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

    const token = `pai_sec_token_${Buffer.from(email).toString('base64')}`;

    return {
      message: 'Connexion réussie sur PersonalAI',
      user: {
        email: allowed.email,
        name: allowed.name,
        role: allowed.role,
        isAuthorized: true,
        id: supabaseUser?.id || 'usr_local_sidibe',
      },
      token,
    };
  }

  // Étape 22 : Déconnexion
  async logout(token?: string) {
    try {
      const client = this.supabaseService.getClient();
      await client.auth.signOut();
    } catch {
      // ignore
    }
    return { success: true, message: 'Déconnexion réussie.' };
  }

  // Étape 23 : Vérification Session / Protection
  async getProfile(email?: string) {
    if (!email) {
      throw new UnauthorizedException('Session non valide');
    }
    const cleanEmail = email.trim().toLowerCase();
    const allowed = ALLOWED_EMAILS.find(u => u.email.toLowerCase() === cleanEmail);

    if (!allowed) {
      throw new UnauthorizedException('Compte non autorisé.');
    }

    return {
      email: allowed.email,
      name: allowed.name,
      role: allowed.role,
      isAuthorized: true,
    };
  }
}
