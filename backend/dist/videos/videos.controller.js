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
import { Controller, Get, Post, Delete, Body, Query, Param, Headers, UseGuards, Req, } from '@nestjs/common';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
let VideosController = class VideosController {
    videosService;
    whisperService;
    logsService;
    constructor(videosService, whisperService, logsService) {
        this.videosService = videosService;
        this.whisperService = whisperService;
        this.logsService = logsService;
    }
    async findAll() {
        return this.videosService.findAll();
    }
    async searchVideos(query) {
        return this.videosService.searchVideos(query);
    }
    async create(body, email, req) {
        const vid = await this.videosService.create(body);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', 'VIDEO', vid.id, vid.title, 'Vidéo enregistrée dans la base de données', ip);
        return vid;
    }
    async remove(id, email, req) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        const result = await this.videosService.remove(id);
        await this.logsService.logAudit(userEmail, 'DELETE', 'VIDEO', id, `Video-${id}`, `Suppression de la vidéo ${id} de la base de données`, ip);
        return result;
    }
    async transcribe(body) {
        const title = body.title || 'Tutoriel NestJS Microservices Architecture.mp4';
        const videoPath = body.videoPath || '/uploads/sample.mp4';
        return this.whisperService.transcribeVideo(videoPath, title);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findAll", null);
__decorate([
    Get('search'),
    __param(0, Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "searchVideos", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "create", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "remove", null);
__decorate([
    Post('transcribe'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "transcribe", null);
VideosController = __decorate([
    Controller('videos'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [VideosService,
        WhisperService,
        SecurityLogsService])
], VideosController);
export { VideosController };
//# sourceMappingURL=videos.controller.js.map