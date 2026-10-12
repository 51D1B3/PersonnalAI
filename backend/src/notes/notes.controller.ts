import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly logsService: SecurityLogsService
  ) {}

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const note = await this.notesService.create(createNoteDto);
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'UPLOAD',
      'NOTE',
      note.id,
      note.title,
      'Note enregistrée dans la base de données',
      ip
    );

    return note;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    const result = await this.notesService.remove(id);
    await this.logsService.logAudit(
      userEmail,
      'DELETE',
      'NOTE',
      id,
      `Note-${id}`,
      `Suppression de la note ${id} de la base de données`,
      ip
    );

    return result;
  }
}
