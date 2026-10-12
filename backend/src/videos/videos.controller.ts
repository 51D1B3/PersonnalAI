import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';
import { SecurityLogsService } from '../security/security-logs.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('videos')
@UseGuards(AuthGuard)
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly whisperService: WhisperService,
    private readonly logsService: SecurityLogsService
  ) {}

  @Get()
  async findAll() {
    return this.videosService.findAll();
  }

  // Étape 50 : Recherche dans les vidéos et leurs transcriptions
  @Get('search')
  async searchVideos(@Query('q') query: string) {
    return this.videosService.searchVideos(query);
  }

  @Post()
  async create(
    @Body() body: any,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const vid = await this.videosService.create(body);
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    await this.logsService.logAudit(
      userEmail,
      'UPLOAD',
      'VIDEO',
      vid.id,
      vid.title,
      'Vidéo enregistrée dans la base de données',
      ip
    );

    return vid;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('x-user-email') email?: string,
    @Req() req?: Request
  ) {
    const userEmail = email || 'mahamadousidibe2004@gmail.com';
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

    const result = await this.videosService.remove(id);
    await this.logsService.logAudit(
      userEmail,
      'DELETE',
      'VIDEO',
      id,
      `Video-${id}`,
      `Suppression de la vidéo ${id} de la base de données`,
      ip
    );

    return result;
  }

  // Étape 47, 48, 49: OpenAI Whisper audio extraction & embeddings creation
  @Post('transcribe')
  async transcribe(@Body() body: { videoPath?: string; title?: string }) {
    const title = body.title || 'Tutoriel NestJS Microservices Architecture.mp4';
    const videoPath = body.videoPath || '/uploads/sample.mp4';
    return this.whisperService.transcribeVideo(videoPath, title);
  }
}
