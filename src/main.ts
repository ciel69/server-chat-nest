import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
// import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3030);
}
bootstrap();
