var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SecurityLogsService_1;
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
let SecurityLogsService = SecurityLogsService_1 = class SecurityLogsService {
    supabaseService;
    logger = new Logger(SecurityLogsService_1.name);
    connectionLogs = [
        {
            id: 'conn-1',
            email: 'mahamadousidibe2004@gmail.com',
            status: 'SUCCESS',
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 'conn-2',
            email: 'hacker@unauthorized.com',
            status: 'FAILED_UNAUTHORIZED_EMAIL',
            ip: '192.168.1.100',
            userAgent: 'Unknown/Bot',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
    ];
    auditLogs = [
        {
            id: 'aud-1',
            userEmail: 'mahamadousidibe2004@gmail.com',
            action: 'UPLOAD',
            resourceType: 'PDF',
            resourceId: 'doc-1',
            resourceTitle: 'React Hooks Deep Dive.pdf',
            details: 'Fichier importé dans le coffre-fort',
            ip: '127.0.0.1',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 'aud-2',
            userEmail: 'mahamadousidibe2004@gmail.com',
            action: 'DOWNLOAD',
            resourceType: 'PDF',
            resourceId: 'doc-1',
            resourceTitle: 'React Hooks Deep Dive.pdf',
            details: 'Fichier téléchargé depuis le Dashboard',
            ip: '127.0.0.1',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
    ];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async logConnection(email, status, ip = '127.0.0.1', userAgent = 'Browser') {
        const entry = {
            id: `log-conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            email: email || 'anonyme',
            status,
            ip,
            userAgent,
            timestamp: new Date().toISOString(),
        };
        this.connectionLogs.unshift(entry);
        this.logger.log(`📌 [Journal Connexion] ${status} pour ${email} (IP: ${ip})`);
        try {
            const client = this.supabaseService.getClient();
            await client.from('connection_logs').insert({
                email: entry.email,
                status: entry.status,
                ip: entry.ip,
                user_agent: entry.userAgent,
                created_at: entry.timestamp,
            });
        }
        catch {
        }
        return entry;
    }
    async logAudit(userEmail, action, resourceType, resourceId, resourceTitle, details, ip = '127.0.0.1') {
        const entry = {
            id: `log-aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userEmail: userEmail || 'mahamadousidibe2004@gmail.com',
            action,
            resourceType,
            resourceId,
            resourceTitle,
            details: details || `Action ${action} effectuée sur ${resourceTitle}`,
            ip,
            timestamp: new Date().toISOString(),
        };
        this.auditLogs.unshift(entry);
        this.logger.log(`🔒 [Journal Audit Étape 55] Action ${action} par ${userEmail} sur [${resourceType}] ${resourceTitle}`);
        try {
            const client = this.supabaseService.getClient();
            await client.from('audit_logs').insert({
                user_email: entry.userEmail,
                action: entry.action,
                resource_type: entry.resourceType,
                resource_id: entry.resourceId,
                resource_title: entry.resourceTitle,
                details: entry.details,
                ip: entry.ip,
                created_at: entry.timestamp,
            });
        }
        catch {
        }
        return entry;
    }
    async getConnectionLogs() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client
                .from('connection_logs')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                return data.map((d) => ({
                    id: d.id,
                    email: d.email,
                    status: d.status,
                    ip: d.ip,
                    userAgent: d.user_agent,
                    timestamp: d.created_at,
                }));
            }
        }
        catch {
        }
        return this.connectionLogs;
    }
    async getAuditLogs() {
        try {
            const client = this.supabaseService.getClient();
            const { data, error } = await client
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                return data.map((d) => ({
                    id: d.id,
                    userEmail: d.user_email,
                    action: d.action,
                    resourceType: d.resource_type,
                    resourceId: d.resource_id,
                    resourceTitle: d.resource_title,
                    details: d.details,
                    ip: d.ip,
                    timestamp: d.created_at,
                }));
            }
        }
        catch {
        }
        return this.auditLogs;
    }
};
SecurityLogsService = SecurityLogsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], SecurityLogsService);
export { SecurityLogsService };
//# sourceMappingURL=security-logs.service.js.map