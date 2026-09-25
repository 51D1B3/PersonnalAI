var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsArray, IsUrl } from 'class-validator';
export class CreateLinkDto {
    name;
    url;
    description;
    category;
    tags;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Le nom du lien est obligatoire' }),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "name", void 0);
__decorate([
    IsUrl({}, { message: 'L\'URL renseignée n\'est pas valide' }),
    IsNotEmpty({ message: 'L\'URL est obligatoire' }),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "url", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "description", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "category", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], CreateLinkDto.prototype, "tags", void 0);
//# sourceMappingURL=create-link.dto.js.map