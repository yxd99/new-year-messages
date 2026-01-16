import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { ICronConfigRepository } from '@domain/repositories/index.js';
import { CRON_CONFIG_REPOSITORY } from '@domain/repositories/index.js';
import { CreateCronConfigDto } from '@application/dtos/index.js';
import { CronConfig } from '@domain/entities/index.js';

@Injectable()
export class CreateCronConfigUseCase {
  constructor(
    @Inject(CRON_CONFIG_REPOSITORY)
    private readonly cronConfigRepository: ICronConfigRepository,
  ) {}

  async execute(dto: CreateCronConfigDto): Promise<CronConfig> {
    const existing = await this.cronConfigRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException(
        `Configuración cron con nombre "${dto.name}" ya existe`,
      );
    }

    return this.cronConfigRepository.create({
      name: dto.name,
      cronExpression: dto.cronExpression,
      isActive: dto.isActive ?? true,
    });
  }
}
