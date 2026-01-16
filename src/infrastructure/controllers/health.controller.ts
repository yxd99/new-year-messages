import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { env } from '@infrastructure/config/env.js';

@ApiTags('health')
@ApiSecurity('api-token')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar estado del servidor' })
  @ApiResponse({
    status: 200,
    description: 'Servidor funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        localTime: { type: 'string', example: '2024-12-31 19:00:00' },
        timezone: { type: 'string', example: 'America/Bogota' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  check() {
    const now = new Date();
    return {
      status: 'ok',
      timestamp: now.toISOString(),
      localTime: now.toLocaleString('es-CO', { timeZone: env.TZ }),
      timezone: env.TZ,
      uptime: process.uptime(),
    };
  }
}
