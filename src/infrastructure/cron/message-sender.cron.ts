import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import type {
  IMessageRepository,
  ICronConfigRepository,
} from '@domain/repositories/index.js';
import {
  MESSAGE_REPOSITORY,
  CRON_CONFIG_REPOSITORY,
} from '@domain/repositories/index.js';
import { SendMessageUseCase } from '@application/use-cases/index.js';
import { env } from '@infrastructure/config/env.js';

const MESSAGE_SENDER_CRON_NAME = 'message-sender';

@Injectable()
export class MessageSenderCron implements OnModuleInit {
  private readonly logger = new Logger(MessageSenderCron.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CRON_CONFIG_REPOSITORY)
    private readonly cronConfigRepository: ICronConfigRepository,
  ) {}

  async onModuleInit() {
    await this.initializeCronJob();
  }

  private async initializeCronJob() {
    let config = await this.cronConfigRepository.findByName(
      MESSAGE_SENDER_CRON_NAME,
    );

    if (!config) {
      config = await this.cronConfigRepository.create({
        name: MESSAGE_SENDER_CRON_NAME,
        cronExpression: env.DEFAULT_CRON_EXPRESSION,
        isActive: true,
      });
      this.logger.log(
        `Creada configuración cron por defecto: ${env.DEFAULT_CRON_EXPRESSION}`,
      );
    }

    if (config.isActive) {
      this.createCronJob(config.cronExpression);
    } else {
      this.logger.log('Cron de envío de mensajes está desactivado');
    }
  }

  private createCronJob(cronExpression: string) {
    try {
      if (this.schedulerRegistry.doesExist('cron', MESSAGE_SENDER_CRON_NAME)) {
        this.schedulerRegistry.deleteCronJob(MESSAGE_SENDER_CRON_NAME);
        this.logger.log('Cron job anterior eliminado');
      }

      const job = new CronJob(
        cronExpression,
        () => {
          void this.processPendingMessages();
        },
        null,
        false,
        env.TZ,
      );

      this.schedulerRegistry.addCronJob(MESSAGE_SENDER_CRON_NAME, job);
      job.start();

      this.logger.log(
        `Cron job iniciado con expresión: ${cronExpression} (${env.TZ})`,
      );
    } catch (error) {
      this.logger.error('Error creando cron job:', error);
    }
  }

  private async processPendingMessages() {
    const now = new Date();
    this.logger.debug(
      `Procesando mensajes pendientes... (${now.toLocaleString('es-CO', { timeZone: env.TZ })})`,
    );

    try {
      const pendingMessages =
        await this.messageRepository.findPendingMessages();

      if (pendingMessages.length === 0) {
        this.logger.debug('No hay mensajes pendientes');
        return;
      }

      this.logger.log(
        `Encontrados ${pendingMessages.length} mensajes pendientes`,
      );

      for (const message of pendingMessages) {
        try {
          this.logger.log(
            `Enviando mensaje ${message.id} programado para: ${
              message.scheduledAt
                ? message.scheduledAt.toLocaleString('es-CO', {
                    timeZone: env.TZ,
                  })
                : 'inmediato'
            }`,
          );
          await this.sendMessageUseCase.execute(message.id);
        } catch (error) {
          this.logger.error(`Error procesando mensaje ${message.id}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Error procesando mensajes pendientes:', error);
    }
  }

  async updateCronExpression(newExpression: string): Promise<void> {
    const config = await this.cronConfigRepository.findByName(
      MESSAGE_SENDER_CRON_NAME,
    );

    if (config) {
      await this.cronConfigRepository.update(config.id, {
        cronExpression: newExpression,
      });
    }

    this.createCronJob(newExpression);
    this.logger.log(`Cron actualizado a: ${newExpression}`);
  }

  async toggleCron(isActive: boolean): Promise<void> {
    const config = await this.cronConfigRepository.findByName(
      MESSAGE_SENDER_CRON_NAME,
    );

    if (config) {
      await this.cronConfigRepository.update(config.id, { isActive });
    }

    if (isActive && config) {
      this.createCronJob(config.cronExpression);
    } else if (
      this.schedulerRegistry.doesExist('cron', MESSAGE_SENDER_CRON_NAME)
    ) {
      this.schedulerRegistry.deleteCronJob(MESSAGE_SENDER_CRON_NAME);
      this.logger.log('Cron job detenido');
    }
  }
}
