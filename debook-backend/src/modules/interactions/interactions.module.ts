import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { InteractionsService } from './interactions.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InteractionsListener } from './interactions.listener';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLike]),
    EventEmitterModule.forRoot(),
    NotificationsModule,
  ],
  providers: [
    InteractionsService, 
    InteractionsListener
  ],
  exports: [InteractionsService],
})
export class InteractionsModule {}