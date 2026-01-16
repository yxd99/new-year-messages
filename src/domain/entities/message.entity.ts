import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageStatus, MessagePlatform } from '@domain/enums/index.js';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ type: 'varchar', length: 100 })
  recipient: string;

  @Column({
    type: 'enum',
    enum: MessagePlatform,
  })
  platform: MessagePlatform;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.WAIT,
  })
  status: MessageStatus;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
