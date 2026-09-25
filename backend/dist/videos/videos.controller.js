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
import { Controller, Get, Post, Body } from '@nestjs/common';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
let VideosController = class VideosController {
    videosService;
    whisperService;
    constructor(videosService, whisperService) {
        this.videosService = videosService;
        this.whisperService = whisperService;
    }
    async findAll() {
        return this.videosService.findAll();
    }
    async create(body) {
        return this.videosService.create(body);
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
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "create", null);
__decorate([
    Post('transcribe'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "transcribe", null);
VideosController = __decorate([
    Controller('videos'),
    __metadata("design:paramtypes", [VideosService,
        WhisperService])
], VideosController);
export { VideosController };
//# sourceMappingURL=videos.controller.js.map