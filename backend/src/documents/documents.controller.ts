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
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly logsService: SecurityLogsService
  ) {}

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  // Étape 55 : Journal audit des téléchargements / consultations de documents
  @Get('download/:id')
  async downloadDocument(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const docs = await this.documentsService.findAll();
    const doc = docs.find((d) => d.id === id) || { title: `Document ${id}`, filePath: '/uploads/sample.pdf' };
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'DOWNLOAD',
      'PDF',
      id,
      doc.title,
      `Téléchargement du document ${doc.title}`,
      ip
    );

    return { downloadUrl: doc.filePath, success: true, message: 'Téléchargement enregistré dans le journal audit (Étape 55).' };
  }

  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const doc = await this.documentsService.create(createDocumentDto);
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(userEmail, 'UPLOAD', 'PDF', doc.id, doc.title, 'Création de document', ip);
    return doc;
  }

  // Étape 55 : Journal audit des suppressions de document
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    const result = await this.documentsService.remove(id);
    await this.logsService.logAudit(
      userEmail,
      'DELETE',
      'PDF',
      id,
      `Document-${id}`,
      `Suppression définitive du document ${id}`,
      ip
    );

    return result;
  }
}
