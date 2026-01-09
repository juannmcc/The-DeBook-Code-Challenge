import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { InteractionsService } from './interactions.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostLike]),
    EventEmitterModule.forRoot(),
  ],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}