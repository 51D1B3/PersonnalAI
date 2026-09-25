import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
