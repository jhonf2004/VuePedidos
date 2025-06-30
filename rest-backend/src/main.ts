import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS si es necesario
     app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Escuchar en todas las interfaces, no solo localhost
  await app.listen(3000, '0.0.0.0'); 
}
bootstrap();