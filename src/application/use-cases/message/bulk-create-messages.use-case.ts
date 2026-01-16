import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';
import {
  BulkCreateMessagesDto,
  BulkCreateMessagesResponseDto,
} from '@application/dtos/index.js';

@Injectable()
export class BulkCreateMessagesUseCase {
  private readonly logger = new Logger(BulkCreateMessagesUseCase.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(dto: BulkCreateMessagesDto): Promise<BulkCreateMessagesResponseDto> {
    const response: BulkCreateMessagesResponseDto = {
      total: dto.messages.length,
      created: 0,
      failed: 0,
      messageIds: [],
      errors: [],
    };

    this.logger.log(`Creando ${dto.messages.length} mensajes en bulk...`);

    for (let i = 0; i < dto.messages.length; i++) {
      const messageDto = dto.messages[i];
      try {
        const message = await this.messageRepository.create({
          content: messageDto.content,
          recipient: messageDto.recipient,
          platform: messageDto.platform,
          scheduledAt: messageDto.scheduledAt || null,
        });
        response.messageIds.push(message.id);
        response.created++;
      } catch (error) {
        response.failed++;
        response.errors.push({
          index: i,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
        this.logger.error(`Error creando mensaje ${i}: ${error}`);
      }
    }

    this.logger.log(
      `Bulk completado: ${response.created} creados, ${response.failed} fallidos`,
    );

    return response;
  }
}
