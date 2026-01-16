import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';
import { UpdateMessageDto } from '@application/dtos/index.js';
import { Message } from '@domain/entities/index.js';

@Injectable()
export class UpdateMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageRepository.update(id, dto);

    if (!message) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }

    return message;
  }
}
