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
import { ImagesService } from './images.service.js';
import { OcrService } from './ocr.service.js';
import { CreateImageDto } from './dto/create-image.dto.js';
let ImagesController = class ImagesController {
    imagesService;
    ocrService;
    constructor(imagesService, ocrService) {
        this.imagesService = imagesService;
        this.ocrService = ocrService;
    }
    async findAll() {
        return this.imagesService.findAll();
    }
    async create(createImageDto) {
        return this.imagesService.create(createImageDto);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateImageDto]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "create", null);
__decorate([
    Post('scan-ocr'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "scanOcr", null);
ImagesController = __decorate([
    Controller('images'),
    __metadata("design:paramtypes", [ImagesService,
        OcrService])
], ImagesController);
export { ImagesController };
//# sourceMappingURL=images.controller.js.map