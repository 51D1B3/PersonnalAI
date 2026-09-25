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
import { Controller, Get, Post, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { ClassicSearchDto } from './dto/classic-search.dto.js';
import { SemanticSearchDto } from './dto/semantic-search.dto.js';
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async classicSearch(queryDto) {
        return this.searchService.classicSearch(queryDto);
    }
    async semanticSearch(semanticDto) {
        return this.searchService.semanticSearch(semanticDto);
    }
};
__decorate([
    Get('classic'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClassicSearchDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "classicSearch", null);
__decorate([
    Post('semantic'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SemanticSearchDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "semanticSearch", null);
SearchController = __decorate([
    Controller('search'),
    __metadata("design:paramtypes", [SearchService])
], SearchController);
export { SearchController };
//# sourceMappingURL=search.controller.js.map