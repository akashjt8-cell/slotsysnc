import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: process.env.WEB_URL ?? 'http://localhost:3000', credentials: true } });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  console.log(`SlotSync API listening on http://localhost:${port}/api/v1`);
}
bootstrap();
