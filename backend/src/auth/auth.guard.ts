import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    // Allow requests with token or authorization header
    if (!authHeader && !request.headers['x-user-email']) {
      // For development ease, allow requests with default header or throw Unauthorized
      return true;
    }

    const email = (request.headers['x-user-email'] as string) || '';
    if (email && !email.endsWith('@personalai.dev')) {
      throw new UnauthorizedException('Accès refusé pour cet email.');
    }

    return true;
  }
}
