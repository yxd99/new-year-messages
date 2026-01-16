import { Injectable, Logger } from '@nestjs/common';
import { IMessagingPort, SendMessageResult } from '@application/ports/index.js';
import { env } from '@infrastructure/config/env.js';

@Injectable()
export class TikTokMessagingAdapter implements IMessagingPort {
  private readonly logger = new Logger(TikTokMessagingAdapter.name);

  async sendMessage(
    recipient: string,
    content: string,
  ): Promise<SendMessageResult> {
    const apiUrl = env.TIKTOK_API_URL;
    const accessToken = env.TIKTOK_ACCESS_TOKEN;

    if (!apiUrl || !accessToken) {
      this.logger.warn(
        'TikTok API no configurada. Simulando envío de mensaje...',
      );
      this.logger.log(`[SIMULADO] Enviando a TikTok: ${recipient}`);
      this.logger.log(`[SIMULADO] Contenido: ${content}`);
      return {
        success: true,
        messageId: `sim_tt_${Date.now()}`,
      };
    }

    try {
      const response = await fetch(`${apiUrl}/message/send/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: recipient,
          message: {
            text: content,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Error TikTok API: ${error}`);
        return {
          success: false,
          error: `Error de API: ${response.status}`,
        };
      }

      const data = (await response.json()) as { data?: { message_id?: string } };
      this.logger.log(`Mensaje TikTok enviado exitosamente a ${recipient}`);

      return {
        success: true,
        messageId: data.data?.message_id,
      };
    } catch (error) {
      this.logger.error('Error enviando mensaje TikTok:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
