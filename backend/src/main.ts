import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import connectDB from './db';
import cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();

  // ... (inside bootstrap)

  const app = await NestFactory.create(AppModule);

  // Increase payload limit
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);

}
bootstrap();
