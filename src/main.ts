import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './db';

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
