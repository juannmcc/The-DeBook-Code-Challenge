import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  findOne(id: number): Promise<Post | null> {
    return this.postRepo.findOne({ where: { id } });
  }

  async incrementLikes(post: Post, increment = 1): Promise<Post> {
    post.likes_count += increment;
    return this.postRepo.save(post);
  }

  async findAll(page = 1, limit = 50): Promise<{ data: Post[]; total: number }> {
    const [data, total] = await this.postRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total };
  }
}
