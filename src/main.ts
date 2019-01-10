import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session';

import { AppModule } from './app.module';
// import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
      secret: 'nest is awesome',
      resave: true,
      saveUninitialized: true,
    }));
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3030);
}
bootstrap();
