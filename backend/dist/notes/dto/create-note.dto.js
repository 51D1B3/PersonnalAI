var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
export class CreateNoteDto {
    title;
    content;
    category;
    tags;
    isVault;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Le titre de la note est obligatoire' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Le contenu de la note est obligatoire' }),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "content", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateNoteDto.prototype, "category", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], CreateNoteDto.prototype, "tags", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateNoteDto.prototype, "isVault", void 0);
//# sourceMappingURL=create-note.dto.js.map