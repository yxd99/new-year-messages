import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { IMessagingPort, SendMessageResult } from '@application/ports/index.js';

@Injectable()
export class WhatsAppMessagingAdapter
  implements IMessagingPort, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(WhatsAppMessagingAdapter.name);
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session',
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('qr', (qr) => {
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('📱 Escanea este código QR con WhatsApp:');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      qrcode.generate(qr, { small: true });
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log('✅ WhatsApp conectado y listo para enviar mensajes!');
    });

    this.client.on('authenticated', () => {
      this.logger.log('🔐 WhatsApp autenticado correctamente');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('❌ Error de autenticación WhatsApp:', msg);
      this.isReady = false;
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('⚠️ WhatsApp desconectado:', reason);
      this.isReady = false;
    });

    this.client.on('message', (msg) => {
      this.logger.debug(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);
    });
  }

  async onModuleInit() {
    this.logger.log('🚀 Iniciando cliente de WhatsApp Web...');
    try {
      await this.client.initialize();
    } catch (error) {
      this.logger.error('Error inicializando WhatsApp:', error);
    }
  }

  async onModuleDestroy() {
    this.logger.log('🛑 Cerrando cliente de WhatsApp...');
    if (this.client) {
      await this.client.destroy();
    }
  }

  async sendMessage(
    recipient: string,
    content: string,
  ): Promise<SendMessageResult> {
    if (!this.isReady) {
      this.logger.warn(
        '⚠️ WhatsApp no está listo. Escanea el código QR primero.',
      );
      return {
        success: false,
        error: 'WhatsApp no está conectado. Escanea el código QR.',
      };
    }

    try {
      const chatId = this.formatPhoneNumber(recipient);

      this.logger.log(`📤 Enviando mensaje a ${chatId}...`);

      const message = await this.client.sendMessage(chatId, content);

      this.logger.log(`✅ Mensaje enviado exitosamente a ${recipient}`);

      return {
        success: true,
        messageId: message.id._serialized,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando mensaje a ${recipient}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }

    return `${cleaned}@c.us`;
  }

  isConnected(): boolean {
    return this.isReady;
  }

  async getStatus(): Promise<{
    connected: boolean;
    info?: { pushname?: string; wid?: string };
  }> {
    if (!this.isReady) {
      return { connected: false };
    }

    try {
      const info = this.client.info;
      return {
        connected: true,
        info: {
          pushname: info?.pushname,
          wid: info?.wid?._serialized,
        },
      };
    } catch {
      return { connected: false };
    }
  }
}
