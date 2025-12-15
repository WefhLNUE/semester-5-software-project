import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './db';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();

  const app = await NestFactory.create(AppModule);

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
