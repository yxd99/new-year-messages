import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@infrastructure/config/index.js';
import { Message, CronConfig } from '@domain/entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Message, CronConfig]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
