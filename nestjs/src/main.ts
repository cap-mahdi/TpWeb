import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/public/', express.static(join(__dirname, '..', 'public')));


  await app.listen(3000);
  Logger.log(`Server running on http://localhost:3000`);
}
bootstrap();
