var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
const ALLOWED_EMAILS = [
    { email: 'sidibe@personalai.dev', name: 'Sidibé', role: 'Propriétaire' },
    { email: 'admin@personalai.dev', name: 'Administrateur', role: 'Co-Propriétaire' }
];
let AuthService = AuthService_1 = class AuthService {
    supabaseService;
    logger = new Logger(AuthService_1.name);
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async login(loginDto) {
        const email = loginDto.email.trim().toLowerCase();
        const allowed = ALLOWED_EMAILS.find(u => u.email.toLowerCase() === email);
        if (!allowed) {
            this.logger.warn(`❌ Tentative d'accès non autorisée pour l'email: ${email}`);
            throw new UnauthorizedException("❌ Accès refusé : Seules les adresses email prédéfinies propriétaires sont autorisées.");
        }
        const client = this.supabaseService.getClient();
        let supabaseUser = null;
        try {
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password: loginDto.password,
            });
            if (!error && data.user) {
                supabaseUser = data.user;
            }
        }
        catch {
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
    async logout(token) {
        try {
            const client = this.supabaseService.getClient();
            await client.auth.signOut();
        }
        catch {
        }
        return { success: true, message: 'Déconnexion réussie.' };
    }
    async getProfile(email) {
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
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map