import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { TwoFactorService } from '../security/two-factor.service.js';
export declare class AuthService {
    private readonly supabaseService;
    private readonly securityLogsService;
    private readonly twoFactorService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, securityLogsService: SecurityLogsService, twoFactorService: TwoFactorService);
    login(loginDto: LoginDto, clientIp?: string, userAgent?: string): Promise<{
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
    verifyUser(authorization?: string, clientIp?: string, userAgent?: string): Promise<{
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
}
