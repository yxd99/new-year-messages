import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { env } from '@infrastructure/config/env.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('New Year Messages API')
    .setDescription(
      'API para envío automático de mensajes de Año Nuevo via WhatsApp Web y TikTok',
    )
    .setVersion('1.0')
    .addTag('messages', 'Gestión de mensajes')
    .addTag('cron-config', 'Configuración de cron jobs')
    .addTag('whatsapp', 'Estado de WhatsApp')
    .addTag('health', 'Estado del servidor')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT);

  logger.log(`🚀 Servidor corriendo en http://localhost:${env.PORT}/api`);
  logger.log(`📚 Swagger docs: http://localhost:${env.PORT}/api/docs`);
  logger.log(`📊 Health check: http://localhost:${env.PORT}/api/health`);
  logger.log(`📨 Mensajes API: http://localhost:${env.PORT}/api/messages`);
  logger.log(`⏰ Cron Config: http://localhost:${env.PORT}/api/cron-config`);
}

void bootstrap();
