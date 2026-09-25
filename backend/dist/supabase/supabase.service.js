var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseService_1;
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
let SupabaseService = SupabaseService_1 = class SupabaseService {
    logger = new Logger(SupabaseService_1.name);
    client;
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-project')) {
            this.logger.warn('⚠️ Supabase credentials are missing or unconfigured in backend/.env!');
        }
        this.client = createClient(supabaseUrl, supabaseKey);
    }
    getClient() {
        return this.client;
    }
};
SupabaseService = SupabaseService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SupabaseService);
export { SupabaseService };
//# sourceMappingURL=supabase.service.js.map