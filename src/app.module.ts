import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/modules/database.module.js';
import { MessagingModule } from '@infrastructure/modules/messaging.module.js';

@Module({
  imports: [DatabaseModule, MessagingModule],
})
export class AppModule {}
