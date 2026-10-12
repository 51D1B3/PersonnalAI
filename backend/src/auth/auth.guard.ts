import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const email = (request.headers['x-user-email'] as string) || '';

    // If no email header provided, allow for dev ease
    if (!email) {
      return true;
    }

    const allowedEmails: string[] = [
      process.env.ALLOWED_EMAIL_1?.toLowerCase().trim(),
      process.env.ALLOWED_EMAIL_2?.toLowerCase().trim(),
    ].filter(Boolean) as string[];

    if (process.env.ALLOWED_EMAILS) {
      process.env.ALLOWED_EMAILS.split(',')
        .map((e) => e.toLowerCase().trim())
        .forEach((e) => {
          if (e && !allowedEmails.includes(e)) allowedEmails.push(e);
        });
    }

    if (allowedEmails.length === 0) {
      allowedEmails.push(
        'mahamadousidibe2004@gmail.com',
        'mahamadousidibe2104@gmail.com',
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!allowedEmails.includes(cleanEmail)) {
      throw new UnauthorizedException(`Accès refusé pour l'email: ${email}`);
    }

    return true;
  }
}
