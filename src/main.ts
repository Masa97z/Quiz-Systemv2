import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 1️⃣ ملفات الفرونت
  app.use(express.static(join(__dirname, '..', 'public')));

  // 2️⃣ Swagger
  const config = new DocumentBuilder()
    .setTitle('Beity System API - نظام بيتي')
    .setDescription('The official API documentation for Beity System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 3️⃣ fallback (مهم جدًا 👇)
  app.use((req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/api-docs')) {
      return next();
    }
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });

  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger: http://localhost:3000/api-docs`);
}
bootstrap();