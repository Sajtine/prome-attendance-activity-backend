import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowed origins
  const allowedOrigins = [
    'http://localhost:3001', // local dev
    'https://prome-attendance-activity-frontend-pkk9d5kbm.vercel.app', // Vercel frontend
  ];

  app.enableCors({
    origin: function(origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();