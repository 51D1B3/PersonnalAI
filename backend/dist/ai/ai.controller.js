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
import { EmbeddingService } from './embedding.service.js';
let AiController = class AiController {
    embeddingService;
    constructor(embeddingService) {
        this.embeddingService = embeddingService;
    }
    async getStatus() {
        return this.embeddingService.checkOllamaStatus();
    }
    async testCompletion(prompt) {
        const query = prompt || 'Explique brièvement le rôle de useState dans React';
        return this.embeddingService.testAiCompletion(query);
    }
    async generateEmbedding(text) {
        const input = text || 'Cours sur les hooks React';
        const vector = await this.embeddingService.generateEmbedding(input);
        return {
            text: input,
            vectorLength: vector.length,
            sampleDimensions: vector.slice(0, 5),
        };
    }
};
__decorate([
    Get('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getStatus", null);
__decorate([
    Post('test'),
    __param(0, Body('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "testCompletion", null);
__decorate([
    Post('embedding'),
    __param(0, Body('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateEmbedding", null);
AiController = __decorate([
    Controller('ai'),
    __metadata("design:paramtypes", [EmbeddingService])
], AiController);
export { AiController };
//# sourceMappingURL=ai.controller.js.map