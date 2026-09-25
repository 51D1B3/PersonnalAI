import { Controller, Get, Post, Body } from '@nestjs/common';
import { VideosService } from './videos.service.js';
import { WhisperService } from './whisper.service.js';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly whisperService: WhisperService
  ) {}

  @Get()
  async findAll() {
    return this.videosService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.videosService.create(body);
  }

  // Étape 47, 48, 49: OpenAI Whisper audio extraction & embeddings creation
  @Post('transcribe')
  async transcribe(@Body() body: { videoPath?: string; title?: string }) {
    const title = body.title || 'Tutoriel NestJS Microservices Architecture.mp4';
    const videoPath = body.videoPath || '/uploads/sample.mp4';
    return this.whisperService.transcribeVideo(videoPath, title);
  }
}
