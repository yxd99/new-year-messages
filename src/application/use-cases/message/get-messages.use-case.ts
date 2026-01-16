import { Injectable, Inject } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';
import { Message } from '@domain/entities/index.js';
import { MessageStatus } from '@domain/enums/index.js';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(): Promise<Message[]> {
    return this.messageRepository.findAll();
  }

  async executeByStatus(status: MessageStatus): Promise<Message[]> {
    return this.messageRepository.findByStatus(status);
  }

  async executeById(id: string): Promise<Message | null> {
    return this.messageRepository.findById(id);
  }
}
