import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { InteractionsService } from './interactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}