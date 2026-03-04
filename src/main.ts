import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { all } from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowed origins
  const allowedOrigins = [
    'http://localhost:3001', // local dev
    // 'https://prome-attendance-activity-frontend-pkk9d5kbm.vercel.app', // Vercel frontend
    process.env.FRONTEND_URL, // from .env
  ].filter(Boolean);

  app.enableCors({
    origin: function(origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
     if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();