import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { Message, CronConfig } from '@domain/entities/index.js';
import {
  MESSAGE_REPOSITORY,
  CRON_CONFIG_REPOSITORY,
} from '@domain/repositories/index.js';
import {
  WHATSAPP_MESSAGING_PORT,
  TIKTOK_MESSAGING_PORT,
} from '@application/ports/index.js';
import {
  CreateMessageUseCase,
  GetMessagesUseCase,
  UpdateMessageUseCase,
  DeleteMessageUseCase,
  SendMessageUseCase,
  BulkCreateMessagesUseCase,
  CreateCronConfigUseCase,
  GetCronConfigsUseCase,
  UpdateCronConfigUseCase,
} from '@application/use-cases/index.js';
import {
  MessageRepository,
  CronConfigRepository,
} from '@infrastructure/repositories/index.js';
import {
  WhatsAppMessagingAdapter,
  TikTokMessagingAdapter,
} from '@infrastructure/adapters/index.js';
import {
  MessageController,
  CronConfigController,
  HealthController,
  WhatsAppController,
} from '@infrastructure/controllers/index.js';
import { MessageSenderCron } from '@infrastructure/cron/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, CronConfig]),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    MessageController,
    CronConfigController,
    HealthController,
    WhatsAppController,
  ],
  providers: [
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
    {
      provide: CRON_CONFIG_REPOSITORY,
      useClass: CronConfigRepository,
    },
    {
      provide: WHATSAPP_MESSAGING_PORT,
      useClass: WhatsAppMessagingAdapter,
    },
    {
      provide: TIKTOK_MESSAGING_PORT,
      useClass: TikTokMessagingAdapter,
    },
    CreateMessageUseCase,
    GetMessagesUseCase,
    UpdateMessageUseCase,
    DeleteMessageUseCase,
    SendMessageUseCase,
    BulkCreateMessagesUseCase,
    CreateCronConfigUseCase,
    GetCronConfigsUseCase,
    UpdateCronConfigUseCase,
    MessageSenderCron,
  ],
  exports: [MessageSenderCron],
})
export class MessagingModule {}
