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



await app.listen(process.env.PORT || 5778, '0.0.0.0');

  console.log(`Application is running on: http://localhost:5778`);
  console.log(`Swagger: http://localhost:5778/api-docs`);
}
bootstrap();
