import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronConfig } from '@domain/entities/index.js';
import { ICronConfigRepository } from '@domain/repositories/index.js';

@Injectable()
export class CronConfigRepository implements ICronConfigRepository {
  constructor(
    @InjectRepository(CronConfig)
    private readonly repository: Repository<CronConfig>,
  ) {}

  async create(config: Partial<CronConfig>): Promise<CronConfig> {
    const newConfig = this.repository.create(config);
    return this.repository.save(newConfig);
  }

  async findAll(): Promise<CronConfig[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CronConfig | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CronConfig | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findActive(): Promise<CronConfig[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: string, data: Partial<CronConfig>): Promise<CronConfig | null> {
    const config = await this.findById(id);
    if (!config) return null;

    Object.assign(config, data);
    return this.repository.save(config);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
