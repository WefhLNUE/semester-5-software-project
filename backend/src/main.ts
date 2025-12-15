import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './db';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Connect to MongoDB
  console.log('DEBUG: URI from env is:', process.env.MONGO_URI);
  await connectDB();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // LOG EVERYTHING
  app.use((req, res, next) => {
    console.log(`➡️  RECEIVED REQUEST: ${req.method} ${req.url}`);
    next();
  });

  app.enableCors({
    origin: 'http://localhost:3000', // Explicit origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);

}
bootstrap();
