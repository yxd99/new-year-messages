import { Injectable, Inject } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';
import { CreateMessageDto } from '@application/dtos/index.js';
import { Message } from '@domain/entities/index.js';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(dto: CreateMessageDto): Promise<Message> {
    return this.messageRepository.create({
      content: dto.content,
      recipient: dto.recipient,
      platform: dto.platform,
      scheduledAt: dto.scheduledAt || null,
    });
  }
}
