import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';

@Injectable()
export class DeleteMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const deleted = await this.messageRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }

    return true;
  }
}
