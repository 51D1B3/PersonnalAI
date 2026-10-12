import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  // Storage for request rates per IP: key -> { count, resetTime }
  private readonly requestCounts = new Map<string, RateLimitRecord>();

  // Default limits: 100 requests per 15 minutes window (900,000 ms)
  private readonly WINDOW_MS = 15 * 60 * 1000;
  private readonly MAX_REQUESTS = 100;

  // Strict limit for login endpoint: 10 requests per 1 minute window
  private readonly LOGIN_WINDOW_MS = 60 * 1000;
  private readonly LOGIN_MAX_REQUESTS = 10;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
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
      this.logger.warn(
        `⛔ Rate limit dépassé pour l'IP ${ip} sur ${path}. Dépassement: ${record.count}/${maxLimit}`
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `⛔ Trop de requêtes (Rate Limiting). Veuillez réanalyser ou réessayer dans ${retryAfterSec} seconde(s).`,
          retryAfter: retryAfterSec,
          limit: maxLimit,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    record.count += 1;
    return true;
  }
}
