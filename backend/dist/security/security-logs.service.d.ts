import { SupabaseService } from '../supabase/supabase.service.js';
export interface ConnectionLogEntry {
    id: string;
    email: string;
    status: 'SUCCESS' | 'FAILED_UNAUTHORIZED_EMAIL' | 'FAILED_INVALID_PASSWORD' | 'FAILED_2FA';
    ip: string;
    userAgent?: string;
    timestamp: string;
}
export interface AuditLogEntry {
    id: string;
    userEmail: string;
    action: 'DELETE' | 'DOWNLOAD' | 'UPLOAD' | 'VIEW' | 'SECURITY';
    resourceType: string;
    resourceId: string;
    resourceTitle: string;
    details?: string;
    ip: string;
    timestamp: string;
}
export declare class SecurityLogsService {
    private readonly supabaseService;
    private readonly logger;
    private connectionLogs;
    private auditLogs;
    constructor(supabaseService: SupabaseService);
    logConnection(email: string, status: ConnectionLogEntry['status'], ip?: string, userAgent?: string): Promise<ConnectionLogEntry>;
    logAudit(userEmail: string, action: AuditLogEntry['action'], resourceType: string, resourceId: string, resourceTitle: string, details?: string, ip?: string): Promise<AuditLogEntry>;
    getConnectionLogs(): Promise<ConnectionLogEntry[]>;
    getAuditLogs(): Promise<AuditLogEntry[]>;
}
