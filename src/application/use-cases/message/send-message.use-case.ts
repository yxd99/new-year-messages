import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IMessageRepository } from '@domain/repositories/index.js';
import { MESSAGE_REPOSITORY } from '@domain/repositories/index.js';
import type { IMessagingPort } from '@application/ports/index.js';
import {
  WHATSAPP_MESSAGING_PORT,
  TIKTOK_MESSAGING_PORT,
} from '@application/ports/index.js';
import { Message } from '@domain/entities/index.js';
import { MessageStatus, MessagePlatform } from '@domain/enums/index.js';

@Injectable()
export class SendMessageUseCase {
  private readonly logger = new Logger(SendMessageUseCase.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(WHATSAPP_MESSAGING_PORT)
    private readonly whatsappMessaging: IMessagingPort,
    @Inject(TIKTOK_MESSAGING_PORT)
    private readonly tiktokMessaging: IMessagingPort,
  ) {}

  async execute(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new Error(`Mensaje con ID ${messageId} no encontrado`);
    }

    await this.messageRepository.update(messageId, {
      status: MessageStatus.SENDING,
    });

    try {
      const messagingService = this.getMessagingService(message.platform);
      const result = await messagingService.sendMessage(
        message.recipient,
        message.content,
      );

      if (result.success) {
        await this.messageRepository.update(messageId, {
          status: MessageStatus.SENT,
          sentAt: new Date(),
        });
        this.logger.log(
          `Mensaje ${messageId} enviado exitosamente a ${message.platform}`,
        );
      } else {
        await this.messageRepository.update(messageId, {
          status: MessageStatus.WAIT,
        });
        this.logger.error(
          `Error enviando mensaje ${messageId}: ${result.error}`,
        );
      }
    } catch (error) {
      await this.messageRepository.update(messageId, {
        status: MessageStatus.WAIT,
      });
      this.logger.error(`Error enviando mensaje ${messageId}:`, error);
      throw error;
    }

    return (await this.messageRepository.findById(messageId))!;
  }

  private getMessagingService(platform: MessagePlatform): IMessagingPort {
    switch (platform) {
      case MessagePlatform.WHATSAPP:
        return this.whatsappMessaging;
      case MessagePlatform.TIKTOK:
        return this.tiktokMessaging;
      default:
        throw new Error(`Plataforma ${platform} no soportada`);
    }
  }
}
