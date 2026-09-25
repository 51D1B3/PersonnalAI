import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service.js';
import { AiController } from './ai.controller.js';

@Module({
  controllers: [AiController],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class AiModule {}

