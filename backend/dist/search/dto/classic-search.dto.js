var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsIn } from 'class-validator';
export class ClassicSearchDto {
    query;
    category;
    tag;
    type;
    sortBy = 'date';
    sortOrder = 'desc';
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "query", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "category", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "tag", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "type", void 0);
__decorate([
    IsString(),
    IsOptional(),
    IsIn(['date', 'title', 'relevance']),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "sortBy", void 0);
__decorate([
    IsString(),
    IsOptional(),
    IsIn(['asc', 'desc']),
    __metadata("design:type", String)
], ClassicSearchDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=classic-search.dto.js.map