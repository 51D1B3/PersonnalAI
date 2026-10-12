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
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
let ImagesController = class ImagesController {
    imagesService;
    ocrService;
    logsService;
    constructor(imagesService, ocrService, logsService) {
        this.imagesService = imagesService;
        this.ocrService = ocrService;
        this.logsService = logsService;
    }
    async findAll() {
        return this.imagesService.findAll();
    }
    async create(createImageDto, email, req) {
        const img = await this.imagesService.create(createImageDto);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', 'IMAGE', img.id, img.title, 'Image / capture d\'écran enregistrée dans la base de données', ip);
        return img;
    }
    async remove(id, email, req) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        const result = await this.imagesService.remove(id);
        await this.logsService.logAudit(userEmail, 'DELETE', 'IMAGE', id, `Image-${id}`, `Suppression de l'image ${id} de la base de données`, ip);
        return result;
    }
    async scanOcr(body) {
        const title = body.title || 'Capture Erreur Prisma P1001.png';
        const imagePath = body.imagePath || '/uploads/sample.png';
        return this.ocrService.processImageOcr(imagePath, title);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "findAll", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateImageDto, String, Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "create", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "remove", null);
__decorate([
    Post('scan-ocr'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "scanOcr", null);
ImagesController = __decorate([
    Controller('images'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [ImagesService,
        OcrService,
        SecurityLogsService])
], ImagesController);
export { ImagesController };
//# sourceMappingURL=images.controller.js.map