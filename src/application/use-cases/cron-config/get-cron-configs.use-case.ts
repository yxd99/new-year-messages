import { Injectable, Inject } from '@nestjs/common';
import type { ICronConfigRepository } from '@domain/repositories/index.js';
import { CRON_CONFIG_REPOSITORY } from '@domain/repositories/index.js';
import { CronConfig } from '@domain/entities/index.js';

@Injectable()
export class GetCronConfigsUseCase {
  constructor(
    @Inject(CRON_CONFIG_REPOSITORY)
    private readonly cronConfigRepository: ICronConfigRepository,
  ) {}

  async execute(): Promise<CronConfig[]> {
    return this.cronConfigRepository.findAll();
  }

  async executeById(id: string): Promise<CronConfig | null> {
    return this.cronConfigRepository.findById(id);
  }

  async executeActive(): Promise<CronConfig[]> {
    return this.cronConfigRepository.findActive();
  }
}
