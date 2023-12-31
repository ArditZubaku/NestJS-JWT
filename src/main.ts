import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // First way:
  // const reflector: Reflector = new Reflector();
  // app.useGlobalGuards(new AtGuard(reflector));

  await app.listen(3333);
}
bootstrap();
