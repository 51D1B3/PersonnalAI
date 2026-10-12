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
import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards, Req, } from '@nestjs/common';
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
let LinksController = class LinksController {
    linksService;
    logsService;
    constructor(linksService, logsService) {
        this.linksService = linksService;
        this.logsService = logsService;
    }
    async findAll() {
        return this.linksService.findAll();
    }
    async create(createLinkDto, email, req) {
        const link = await this.linksService.create(createLinkDto);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', 'LINK', link.id, link.name, 'Lien web enregistré dans la base de données', ip);
        return link;
    }
    async remove(id, email, req) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        const result = await this.linksService.remove(id);
        await this.logsService.logAudit(userEmail, 'DELETE', 'LINK', id, `Link-${id}`, `Suppression du lien ${id} de la base de données`, ip);
        return result;
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "findAll", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLinkDto, String, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "create", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "remove", null);
LinksController = __decorate([
    Controller('links'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [LinksService,
        SecurityLogsService])
], LinksController);
export { LinksController };
//# sourceMappingURL=links.controller.js.map