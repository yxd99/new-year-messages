import { Message } from '@domain/entities/message.entity.js';
import { MessageStatus } from '@domain/enums/message-status.enum.js';

export interface IMessageRepository {
  create(message: Partial<Message>): Promise<Message>;
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  findByStatus(status: MessageStatus): Promise<Message[]>;
  findPendingMessages(): Promise<Message[]>;
  update(id: string, data: Partial<Message>): Promise<Message | null>;
  delete(id: string): Promise<boolean>;
}

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');
