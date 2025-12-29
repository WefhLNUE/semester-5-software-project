import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import connectDB from './db';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();

  const app = await NestFactory.create(AppModule);

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

  // Configure CORS - use FRONTEND_URL from environment or allow all in development
  const frontendUrl = process.env.FRONTEND_URL;

  // Parse multiple frontend URLs (comma-separated) or use a function to validate origins
  const allowedOrigins = frontendUrl
    ? frontendUrl.split(',').map(url => url.trim())
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Allow if no frontend URL is configured (development mode)
      if (allowedOrigins.length === 0) return callback(null, true);

      // Allow if origin matches any of the configured URLs
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow all Vercel preview deployments
      if (origin.includes('.vercel.app')) return callback(null, true);

      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin',
    ],
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
  console.log(`🚀 Application is running on: ${backendUrl}`);

}
bootstrap();
