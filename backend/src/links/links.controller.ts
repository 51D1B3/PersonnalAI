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
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('links')
@UseGuards(AuthGuard)
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly logsService: SecurityLogsService
  ) {}

  @Get()
  async findAll() {
    return this.linksService.findAll();
  }

  @Post()
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const link = await this.linksService.create(createLinkDto);
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'UPLOAD',
      'LINK',
      link.id,
      link.name,
      'Lien web enregistré dans la base de données',
      ip
    );

    return link;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    const result = await this.linksService.remove(id);
    await this.logsService.logAudit(
      userEmail,
      'DELETE',
      'LINK',
      id,
      `Link-${id}`,
      `Suppression du lien ${id} de la base de données`,
      ip
    );

    return result;
  }
}
