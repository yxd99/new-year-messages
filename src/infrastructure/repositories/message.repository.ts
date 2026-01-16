import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull, Or } from 'typeorm';
import { Message } from '@domain/entities/index.js';
import { MessageStatus } from '@domain/enums/index.js';
import { IMessageRepository } from '@domain/repositories/index.js';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {}

  async create(message: Partial<Message>): Promise<Message> {
    const newMessage = this.repository.create(message);
    return this.repository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Message | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByStatus(status: MessageStatus): Promise<Message[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'ASC' },
    });
  }

  async findPendingMessages(): Promise<Message[]> {
    const now = new Date();

    return this.repository.find({
      where: [
        {
          status: MessageStatus.WAIT,
          scheduledAt: LessThanOrEqual(now),
        },
        {
          status: MessageStatus.WAIT,
          scheduledAt: IsNull(),
        },
      ],
      order: { scheduledAt: 'ASC', createdAt: 'ASC' },
    });
  }

  async update(id: string, data: Partial<Message>): Promise<Message | null> {
    const message = await this.findById(id);
    if (!message) return null;

    Object.assign(message, data);
    return this.repository.save(message);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
