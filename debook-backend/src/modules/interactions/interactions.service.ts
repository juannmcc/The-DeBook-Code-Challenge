import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { Repository } from 'typeorm';
import { Post } from '../posts/post.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(PostLike)
    private readonly likeRepo: Repository<PostLike>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async likePost(userId: number, post: Post): Promise<{ like: PostLike; wasNew: boolean }> {
    const existing = await this.likeRepo.findOne({
      where: { user_id: userId, post: { id: post.id } },
      relations: ['post'],
    });

    if (existing) return { like: existing, wasNew: false };

    const like = this.likeRepo.create({ user_id: userId, post });
    await this.likeRepo.save(like);
    this.eventEmitter.emit('post.liked', { userId, postId: post.id });

    return { like, wasNew: true };
  }
}
