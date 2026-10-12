export interface TwoFactorSetupResponse {
    secret: string;
    qrCodeUrl: string;
    otpauthUrl: string;
    message: string;
}
export declare class TwoFactorService {
    private readonly logger;
    private user2faState;
    constructor();
    generateSecret(email: string): Promise<TwoFactorSetupResponse>;
    verifyCode(email: string, code: string): Promise<boolean>;
    enable2FA(email: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    disable2FA(email: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getStatus(email: string): {
        enabled: boolean;
        secretConfigured: boolean;
    };
    private verifyTotpCode;
    private generateTotpToken;
    private bufferToBase32;
    private base32ToBuffer;
}
