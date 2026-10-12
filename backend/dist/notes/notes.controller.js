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
import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards, Req, } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
let NotesController = class NotesController {
    notesService;
    logsService;
    constructor(notesService, logsService) {
        this.notesService = notesService;
        this.logsService = logsService;
    }
    async findAll() {
        return this.notesService.findAll();
    }
    async create(createNoteDto, email, req) {
        const note = await this.notesService.create(createNoteDto);
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        await this.logsService.logAudit(userEmail, 'UPLOAD', 'NOTE', note.id, note.title, 'Note enregistrée dans la base de données', ip);
        return note;
    }
    async remove(id, email, req) {
        const userEmail = email || 'mahamadousidibe2004@gmail.com';
        const ip = req?.headers['x-forwarded-for'] || req?.ip || '127.0.0.1';
        const result = await this.notesService.remove(id);
        await this.logsService.logAudit(userEmail, 'DELETE', 'NOTE', id, `Note-${id}`, `Suppression de la note ${id} de la base de données`, ip);
        return result;
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "findAll", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNoteDto, String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "create", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, Headers('x-user-email')),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "remove", null);
NotesController = __decorate([
    Controller('notes'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [NotesService,
        SecurityLogsService])
], NotesController);
export { NotesController };
//# sourceMappingURL=notes.controller.js.map