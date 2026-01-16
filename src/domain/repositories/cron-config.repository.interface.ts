import { CronConfig } from '@domain/entities/cron-config.entity.js';

export interface ICronConfigRepository {
  create(config: Partial<CronConfig>): Promise<CronConfig>;
  findAll(): Promise<CronConfig[]>;
  findById(id: string): Promise<CronConfig | null>;
  findByName(name: string): Promise<CronConfig | null>;
  findActive(): Promise<CronConfig[]>;
  update(id: string, data: Partial<CronConfig>): Promise<CronConfig | null>;
  delete(id: string): Promise<boolean>;
}

export const CRON_CONFIG_REPOSITORY = Symbol('CRON_CONFIG_REPOSITORY');
