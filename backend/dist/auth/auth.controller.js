var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Body, Headers, HttpCode, HttpStatus, Req, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
let AuthController = class AuthController {
    authService;
    supabaseService;
    constructor(authService, supabaseService) {
        this.authService = authService;
        this.supabaseService = supabaseService;
    }
    async verifyUser(authorization, req) {
        if (!authorization) {
            throw new UnauthorizedException('Token manquant');
        }
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Browser';
        return this.authService.verifyUser(authorization, ip, userAgent);
    }
    async login(loginDto, req) {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Browser';
        return this.authService.login(loginDto, ip, userAgent);
    }
    async logout(token, email) {
        return this.authService.logout(token, email);
    }
    async getProfile(email) {
        return this.authService.getProfile(email);
    }
};
__decorate([
    Get('verify'),
    __param(0, Headers('authorization')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUser", null);
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('logout'),
    HttpCode(HttpStatus.OK),
    __param(0, Headers('authorization')),
    __param(1, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Get('me'),
    __param(0, Headers('x-user-email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService,
        SupabaseService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map