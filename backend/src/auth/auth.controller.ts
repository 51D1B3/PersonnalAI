import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Étape 11 : Le contrôleur principal de vérification Google / Supabase
  @Get('verify')
  async verifyUser(
    @Headers('authorization') authorization: string,
    @Req() req: Request,
  ) {
    if (!authorization) {
      throw new UnauthorizedException('Token manquant');
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Browser';

    return this.authService.verifyUser(authorization, ip, userAgent);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Browser';
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') token?: string,
    @Headers('x-user-email') email?: string,
  ) {
    return this.authService.logout(token, email);
  }

  @Get('me')
  async getProfile(@Headers('x-user-email') email?: string) {
    return this.authService.getProfile(email);
  }
}
