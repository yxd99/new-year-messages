import { ApiPropertyOptional } from '@nestjs/swagger';
import { MessagePlatform, MessageStatus } from '@domain/enums/index.js';

export class UpdateMessageDto {
  @ApiPropertyOptional({
    description: 'Contenido del mensaje',
    example: '¡Feliz Año Nuevo 2025! 🎊',
    maxLength: 500,
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono o ID del destinatario',
    example: '+521234567890',
  })
  recipient?: string;

  @ApiPropertyOptional({
    description: 'Plataforma de envío',
    enum: MessagePlatform,
  })
  platform?: MessagePlatform;

  @ApiPropertyOptional({
    description: 'Estado del mensaje',
    enum: MessageStatus,
  })
  status?: MessageStatus;

  @ApiPropertyOptional({
    description: 'Fecha programada para envío (ISO 8601)',
    example: '2025-01-01T00:00:00Z',
  })
  scheduledAt?: Date;
}
