var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
let AuthGuard = class AuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const email = request.headers['x-user-email'] || '';
        if (!email) {
            return true;
        }
        const allowedEmails = [
            process.env.ALLOWED_EMAIL_1?.toLowerCase().trim(),
            process.env.ALLOWED_EMAIL_2?.toLowerCase().trim(),
        ].filter(Boolean);
        if (process.env.ALLOWED_EMAILS) {
            process.env.ALLOWED_EMAILS.split(',')
                .map((e) => e.toLowerCase().trim())
                .forEach((e) => {
                if (e && !allowedEmails.includes(e))
                    allowedEmails.push(e);
            });
        }
        if (allowedEmails.length === 0) {
            allowedEmails.push('mahamadousidibe2004@gmail.com', 'mahamadousidibe2104@gmail.com');
        }
        const cleanEmail = email.trim().toLowerCase();
        if (!allowedEmails.includes(cleanEmail)) {
            throw new UnauthorizedException(`Accès refusé pour l'email: ${email}`);
        }
        return true;
    }
};
AuthGuard = __decorate([
    Injectable()
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map