import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { WHATSAPP_MESSAGING_PORT } from '@application/ports/index.js';
import { WhatsAppMessagingAdapter } from '@infrastructure/adapters/whatsapp-messaging.adapter.js';

@ApiTags('whatsapp')
@ApiSecurity('api-token')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    @Inject(WHATSAPP_MESSAGING_PORT)
    private readonly whatsappAdapter: WhatsAppMessagingAdapter,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Verificar estado de conexión de WhatsApp' })
  @ApiResponse({
    status: 200,
    description: 'Estado de WhatsApp',
    schema: {
      type: 'object',
      properties: {
        platform: { type: 'string', example: 'whatsapp' },
        connected: { type: 'boolean', example: true },
        info: {
          type: 'object',
          properties: {
            pushname: { type: 'string', example: 'Mi Nombre' },
            wid: { type: 'string', example: '521234567890@c.us' },
          },
        },
        message: { type: 'string', example: '✅ WhatsApp conectado' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  async getStatus() {
    const status = await this.whatsappAdapter.getStatus();
    return {
      platform: 'whatsapp',
      ...status,
      message: status.connected
        ? '✅ WhatsApp conectado'
        : '⚠️ WhatsApp desconectado - Escanea el código QR en la consola',
    };
  }
}
