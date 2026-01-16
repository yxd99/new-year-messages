import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessagePlatform } from '@domain/enums/index.js';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Contenido del mensaje',
    example: '¡Feliz Año Nuevo 2025! 🎉',
    maxLength: 500,
  })
  content: string;

  @ApiProperty({
    description: 'Número de teléfono o ID del destinatario',
    example: '+573156486665',
  })
  recipient: string;

  @ApiProperty({
    description: 'Plataforma de envío',
    enum: MessagePlatform,
    example: MessagePlatform.WHATSAPP,
  })
  platform: MessagePlatform;

  @ApiPropertyOptional({
    description:
      'Fecha programada para envío. Usa hora local de Colombia (America/Bogota). Formato: YYYY-MM-DDTHH:mm:ss',
    example: '2025-01-01T00:00:00',
  })
  scheduledAt?: Date;
}
