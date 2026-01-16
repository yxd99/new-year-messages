export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IMessagingPort {
  sendMessage(recipient: string, content: string): Promise<SendMessageResult>;
}

export const WHATSAPP_MESSAGING_PORT = Symbol('WHATSAPP_MESSAGING_PORT');
export const TIKTOK_MESSAGING_PORT = Symbol('TIKTOK_MESSAGING_PORT');
