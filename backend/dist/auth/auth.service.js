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
import { SecurityLogsService } from '../security/security-logs.service.js';
import { TwoFactorService } from '../security/two-factor.service.js';
const ALLOWED_EMAILS = [
    { email: 'mahamadousidibe2004@gmail.com', name: 'Sidibé (Propriétaire)', role: 'Propriétaire' },
    { email: 'mahamadousidibe2104@gmail.com', name: 'Sidibé (Co-Propriétaire)', role: 'Co-Propriétaire' },
];
let AuthService = AuthService_1 = class AuthService {
    supabaseService;
    securityLogsService;
    twoFactorService;
    logger = new Logger(AuthService_1.name);
    constructor(supabaseService, securityLogsService, twoFactorService) {
        this.supabaseService = supabaseService;
        this.securityLogsService = securityLogsService;
        this.twoFactorService = twoFactorService;
    }
    async login(loginDto, clientIp = '127.0.0.1', userAgent = 'Browser') {
        const email = (loginDto.email || '').trim().toLowerCase();
        const allowed = ALLOWED_EMAILS.find((u) => u.email.toLowerCase() === email);
        if (!allowed) {
            this.logger.warn(`❌ Accès refusé et journalisé pour l'email non autorisé: ${email}`);
            await this.securityLogsService.logConnection(email, 'FAILED_UNAUTHORIZED_EMAIL', clientIp, userAgent);
            throw new UnauthorizedException('❌ Accès refusé : Seules les adresses email prédéfinies propriétaires sont autorisées.');
        }
        const twoFactorStatus = this.twoFactorService.getStatus(email);
        if (twoFactorStatus.enabled) {
            const code = loginDto.twoFactorCode;
            if (!code) {
                throw new UnauthorizedException('🔒 Authentification 2FA requise. Veuillez fournir un code à 6 chiffres.');
            }
            const is2faValid = await this.twoFactorService.verifyCode(email, code);
            if (!is2faValid) {
                await this.securityLogsService.logConnection(email, 'FAILED_2FA', clientIp, userAgent);
                throw new UnauthorizedException('🔒 Code 2FA incorrect ou expiré.');
            }
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
    async logout(token, email) {
        try {
            const client = this.supabaseService.getClient();
            await client.auth.signOut();
        }
        catch {
        }
        this.logger.log(`Déconnexion effectuée pour ${email || 'utilisateur'}`);
        return { success: true, message: 'Déconnexion réussie.' };
    }
    async getProfile(email) {
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
    async verifyUser(authorization, clientIp = '127.0.0.1', userAgent = 'Browser') {
        if (!authorization) {
            throw new UnauthorizedException('Token manquant');
        }
        const token = authorization.replace('Bearer ', '').trim();
        if (!token) {
            throw new UnauthorizedException('Token invalide');
        }
        const { data: { user }, error, } = await this.supabaseService.getClient().auth.getUser(token);
        if (error || !user) {
            this.logger.warn(`Tentative d'accès avec un token Supabase invalide ou expiré`);
            throw new UnauthorizedException('Utilisateur non authentifié');
        }
        const email = user.email?.toLowerCase().trim();
        const envAllowed = [
            process.env.ALLOWED_EMAIL_1?.toLowerCase().trim(),
            process.env.ALLOWED_EMAIL_2?.toLowerCase().trim(),
        ].filter(Boolean);
        if (process.env.ALLOWED_EMAILS) {
            process.env.ALLOWED_EMAILS.split(',')
                .map((e) => e.toLowerCase().trim())
                .forEach((e) => {
                if (e && !envAllowed.includes(e))
                    envAllowed.push(e);
            });
        }
        if (envAllowed.length === 0) {
            ALLOWED_EMAILS.forEach((item) => envAllowed.push(item.email.toLowerCase()));
        }
        if (!email || !envAllowed.includes(email)) {
            this.logger.warn(`❌ Accès refusé par le backend pour l'email Google non autorisé: ${email}`);
            await this.securityLogsService.logConnection(email || 'inconnu', 'FAILED_UNAUTHORIZED_EMAIL', clientIp, userAgent);
            throw new UnauthorizedException("Cet email n'est pas autorisé à accéder à PersonalAI.");
        }
        await this.securityLogsService.logConnection(email, 'SUCCESS', clientIp, userAgent);
        this.logger.log(`✅ Accès autorisé par le backend pour: ${email}`);
        const matchingAllowed = ALLOWED_EMAILS.find((u) => u.email.toLowerCase() === email);
        const userName = user.user_metadata?.full_name ||
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
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService,
        SecurityLogsService,
        TwoFactorService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map