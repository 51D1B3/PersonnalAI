import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export declare class AuthController {
    private readonly authService;
    private readonly supabaseService;
    constructor(authService: AuthService, supabaseService: SupabaseService);
    verifyUser(authorization: string, req: Request): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string | undefined;
            name: any;
            role: string;
            isAuthorized: boolean;
        };
    }>;
    login(loginDto: LoginDto, req: Request): Promise<{
        message: string;
        user: {
            email: string;
            name: string;
            role: string;
            isAuthorized: boolean;
            id: string;
            twoFactorEnabled: boolean;
        };
        token: string;
    }>;
    logout(token?: string, email?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(email?: string): Promise<{
        email: string;
        name: string;
        role: string;
        isAuthorized: boolean;
        twoFactorEnabled: boolean;
    }>;
}
