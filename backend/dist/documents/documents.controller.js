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
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
let DocumentsController = class DocumentsController {
    documentsService;
    logsService;
    constructor(documentsService, logsService) {
        this.documentsService = documentsService;
        this.logsService = logsService;
    }
    async findAll() {
        return this.documentsService.findAll();
    }
    async downloadDocument(id, email, req) {
        const docs = await this.documentsService.findAll();
        const doc = docs.find((d) => d.id === id) || { title: `Document ${id}`, filePath: '/uploads/sample.pdf' };
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'DOWNLOAD', 'PDF', id, doc.title, `Téléchargement du document ${doc.title}`, ip);
        return { downloadUrl: doc.filePath, success: true, message: 'Téléchargement enregistré dans le journal audit (Étape 55).' };
    }
    async create(createDocumentDto, email, req) {
        const doc = await this.documentsService.create(createDocumentDto);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', 'PDF', doc.id, doc.title, 'Création de document', ip);
        return doc;
    }
    async remove(id, email, req) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        const result = await this.documentsService.remove(id);
        await this.logsService.logAudit(userEmail, 'DELETE', 'PDF', id, `Document-${id}`, `Suppression définitive du document ${id}`, ip);
        return result;
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findAll", null);
__decorate([
    Get('download/:id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "downloadDocument", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDocumentDto, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "create", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "remove", null);
DocumentsController = __decorate([
    Controller('documents'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [DocumentsService,
        SecurityLogsService])
], DocumentsController);
export { DocumentsController };
//# sourceMappingURL=documents.controller.js.map