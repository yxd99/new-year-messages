import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env.js';
import { Message, CronConfig } from '@domain/entities/index.js';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [Message, CronConfig],
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV === 'development',
};
