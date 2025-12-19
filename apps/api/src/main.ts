import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para versionado limpio
  app.setGlobalPrefix('api');

  // 2. Habilitar CORS para que el Frontend (puerto 3000) pueda llamar aquí
  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  });

  // 3. Puerto 4000 para evitar conflictos
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);

  console.log(`🚀 API is running on: http://localhost:${PORT}/api`);
}
bootstrap();
