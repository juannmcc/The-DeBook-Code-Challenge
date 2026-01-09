import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { InteractionsModule } from '@/modules/interactions/interactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), InteractionsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}