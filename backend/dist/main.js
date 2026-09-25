import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 PersonalAI Backend server running on http://localhost:${port}`);
}
await bootstrap();
//# sourceMappingURL=main.js.map