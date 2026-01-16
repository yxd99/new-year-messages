import { ApiProperty } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto.js';

export class BulkCreateMessagesDto {
  @ApiProperty({
    description: 'Array de mensajes a crear',
    type: [CreateMessageDto],
    example: [
      {
        content: '¡Feliz Año Nuevo 2025! 🎉',
        recipient: '+573001234567',
        platform: 'WHATSAPP',
        scheduledAt: '2025-01-01T00:00:00',
      },
      {
        content: '¡Próspero Año Nuevo! 🥳',
        recipient: '+573009876543',
        platform: 'WHATSAPP',
      },
    ],
  })
  messages: CreateMessageDto[];
}

export class BulkCreateMessagesResponseDto {
  @ApiProperty({
    description: 'Total de mensajes recibidos',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Mensajes creados exitosamente',
    example: 10,
  })
  created: number;

  @ApiProperty({
    description: 'Mensajes que fallaron',
    example: 0,
  })
  failed: number;

  @ApiProperty({
    description: 'IDs de los mensajes creados',
    example: ['uuid-1', 'uuid-2'],
  })
  messageIds: string[];

  @ApiProperty({
    description: 'Errores si hubo alguno',
    example: [],
  })
  errors: { index: number; error: string }[];
}
