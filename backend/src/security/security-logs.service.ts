import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class SecurityLogsService {
  private readonly logger = new Logger(SecurityLogsService.name);

  private connectionLogs: ConnectionLogEntry[] = [
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

  private auditLogs: AuditLogEntry[] = [
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

  constructor(private readonly supabaseService: SupabaseService) {}

  // Étape 54 : Log des connexions
  async logConnection(
    email: string,
    status: ConnectionLogEntry['status'],
    ip: string = '127.0.0.1',
    userAgent: string = 'Browser'
  ): Promise<ConnectionLogEntry> {
    const entry: ConnectionLogEntry = {
      id: `log-conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email || 'anonyme',
      status,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    this.connectionLogs.unshift(entry);
    this.logger.log(`📌 [Journal Connexion] ${status} pour ${email} (IP: ${ip})`);

    // Persistance optionnelle dans Supabase
    try {
      const client = this.supabaseService.getClient();
      await client.from('connection_logs').insert({
        email: entry.email,
        status: entry.status,
        ip: entry.ip,
        user_agent: entry.userAgent,
        created_at: entry.timestamp,
      });
    } catch {
      // Ignorer erreur de fallback local
    }

    return entry;
  }

  // Étape 55 : Journal des suppressions / téléchargements / actions sensibles
  async logAudit(
    userEmail: string,
    action: AuditLogEntry['action'],
    resourceType: string,
    resourceId: string,
    resourceTitle: string,
    details?: string,
    ip: string = '127.0.0.1'
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
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
    this.logger.log(
      `🔒 [Journal Audit Étape 55] Action ${action} par ${userEmail} sur [${resourceType}] ${resourceTitle}`
    );

    // Persistance optionnelle dans Supabase
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
    } catch {
      // Ignorer erreur de fallback local
    }

    return entry;
  }

  async getConnectionLogs(): Promise<ConnectionLogEntry[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client
        .from('connection_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          email: d.email,
          status: d.status,
          ip: d.ip,
          userAgent: d.user_agent,
          timestamp: d.created_at,
        }));
      }
    } catch {
      // Fallback local
    }

    return this.connectionLogs;
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
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
    } catch {
      // Fallback local
    }

    return this.auditLogs;
  }
}
