import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3001',
        /^https:\/\/prome-attendance-activity-frontend.*\.vercel\.app$/,
      ];

      const isAllowed = allowedOrigins.some((rule) =>
        rule instanceof RegExp ? rule.test(origin) : rule === origin,
      );

      if (!isAllowed) {
        return callback(new Error('CORS blocked: origin not allowed.'), false);
      }

      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
