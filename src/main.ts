import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable credentials for front-end
  app.enableCors({
    origin: configService.get('BASE_URL'),
    credentials: true,
  });

  // PORT Configuration
  const port = configService.get('PORT');

  // Add Validation Pipe Globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Use CookieParser
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(port);
}
bootstrap();
