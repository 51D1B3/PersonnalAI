import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export declare class AuthService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            email: string;
            name: string;
            role: string;
            isAuthorized: boolean;
            id: string;
        };
        token: string;
    }>;
}
