import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RateLimitGuard implements CanActivate {
    private readonly logger;
    private readonly requestCounts;
    private readonly WINDOW_MS;
    private readonly MAX_REQUESTS;
    private readonly LOGIN_WINDOW_MS;
    private readonly LOGIN_MAX_REQUESTS;
    canActivate(context: ExecutionContext): boolean;
}
