import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICronConfigRepository } from '@domain/repositories/index.js';
import { CRON_CONFIG_REPOSITORY } from '@domain/repositories/index.js';
import { UpdateCronConfigDto } from '@application/dtos/index.js';
import { CronConfig } from '@domain/entities/index.js';

@Injectable()
export class UpdateCronConfigUseCase {
  constructor(
    @Inject(CRON_CONFIG_REPOSITORY)
    private readonly cronConfigRepository: ICronConfigRepository,
  ) {}

  async execute(id: string, dto: UpdateCronConfigDto): Promise<CronConfig> {
    const config = await this.cronConfigRepository.update(id, dto);

    if (!config) {
      throw new NotFoundException(`Configuración cron con ID ${id} no encontrada`);
    }

    return config;
  }
}
