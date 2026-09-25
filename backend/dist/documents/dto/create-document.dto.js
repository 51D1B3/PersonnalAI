var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
export class CreateDocumentDto {
    title;
    description;
    category;
    tags;
    filePath;
    contentText;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Le titre du document est obligatoire' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'La description du document est obligatoire' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "description", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "category", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], CreateDocumentDto.prototype, "tags", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "filePath", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "contentText", void 0);
//# sourceMappingURL=create-document.dto.js.map