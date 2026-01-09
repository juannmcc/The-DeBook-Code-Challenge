import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async findOneWithCounters(id: number) {
    const raw = await this.postRepo
      .createQueryBuilder('post')
      .select([
        'post.id AS id',
        'post.content AS content',
        'post.likes_count AS likes_count',
        'post.comments_count AS comments_count',
        'post.created_at AS created_at',
        'post.updated_at AS updated_at',
      ])
      .where('post.id = :id', { id })
      .getRawOne();

    if (!raw) return null;

    return {
      id: Number(raw.id),
      content: raw.content,
      likes_count: Number(raw.likes_count),
      comments_count: Number(raw.comments_count),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    };
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    return this.postRepo.find({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async count() {
    return this.postRepo.count();
  }
}
