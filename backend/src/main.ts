import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Étape 53 : Middleware d'en-têtes de sécurité renforcée (Security Headers)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'DENY'); // Protection Clickjacking
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Protection MIME spoofing
    res.setHeader('X-XSS-Protection', '1; mode=block'); // Protection XSS browser
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    ); // Enforce HTTPS
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
    );
    next();
  });

  // Validation DTO avec class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  // Étape 13 : CORS sécurisé pour le frontend Vite
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-user-email',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(
    `🚀 PersonalAI Backend API running on http://localhost:${port} avec Sécurité Avancée (Phase 12)`
  );
}

await bootstrap();
