var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RateLimitGuard_1;
import { Injectable, HttpException, HttpStatus, Logger, } from '@nestjs/common';
let RateLimitGuard = RateLimitGuard_1 = class RateLimitGuard {
    logger = new Logger(RateLimitGuard_1.name);
    requestCounts = new Map();
    WINDOW_MS = 15 * 60 * 1000;
    MAX_REQUESTS = 100;
    LOGIN_WINDOW_MS = 60 * 1000;
    LOGIN_MAX_REQUESTS = 10;
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.ip ||
            '127.0.0.1';
        const path = request.path || request.url || '';
        const isLogin = path.includes('/auth/login');
        const maxLimit = isLogin ? this.LOGIN_MAX_REQUESTS : this.MAX_REQUESTS;
        const windowMs = isLogin ? this.LOGIN_WINDOW_MS : this.WINDOW_MS;
        const storageKey = isLogin ? `login_${ip}` : `gen_${ip}`;
        const now = Date.now();
        const record = this.requestCounts.get(storageKey);
        if (!record || now > record.resetTime) {
            this.requestCounts.set(storageKey, {
                count: 1,
                resetTime: now + windowMs,
            });
            return true;
        }
        if (record.count >= maxLimit) {
            const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
            this.logger.warn(`⛔ Rate limit dépassé pour l'IP ${ip} sur ${path}. Dépassement: ${record.count}/${maxLimit}`);
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `⛔ Trop de requêtes (Rate Limiting). Veuillez réanalyser ou réessayer dans ${retryAfterSec} seconde(s).`,
                retryAfter: retryAfterSec,
                limit: maxLimit,
            }, HttpStatus.TOO_MANY_REQUESTS);
        }
        record.count += 1;
        return true;
    }
};
RateLimitGuard = RateLimitGuard_1 = __decorate([
    Injectable()
], RateLimitGuard);
export { RateLimitGuard };
//# sourceMappingURL=rate-limit.guard.js.map