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
import { Controller, Post, UseInterceptors, UploadedFile, Body, Headers, UseGuards, Req, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service.js';
import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { FileValidationPipe } from '../security/file-validation.pipe.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import 'multer';
let UploadController = class UploadController {
    uploadService;
    logsService;
    constructor(uploadService, logsService) {
        this.uploadService = uploadService;
        this.logsService = logsService;
    }
    async uploadFile(file, metadata, email, req) {
        const result = await this.uploadService.processUpload(file, metadata);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', result.type, result.id, result.title, `Fichier [${file.originalname}] uploadé et validé (${result.fileSize} bytes)`, ip);
        return result;
    }
};
__decorate([
    Post(),
    UseInterceptors(FileInterceptor('file')),
    __param(0, UploadedFile(FileValidationPipe)),
    __param(1, Body()),
    __param(2, Headers('x-user-email')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UploadMetadataDto, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
UploadController = __decorate([
    Controller('upload'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [UploadService,
        SecurityLogsService])
], UploadController);
export { UploadController };
//# sourceMappingURL=upload.controller.js.map