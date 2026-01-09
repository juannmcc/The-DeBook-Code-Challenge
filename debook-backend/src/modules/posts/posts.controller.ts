import { Controller, Get, Param, Post as PostRoute, Headers } from '@nestjs/common';
import { InteractionsService } from '../interactions/interactions.service';
import { PostsService } from './posts.service';
import { Post } from './post.entity';

@Controller('v1/posts')
export class PostsController {
  constructor(
    private readonly interactionsService: InteractionsService,
    private readonly postsService: PostsService,
  ) {}

  @PostRoute(':id/like')
  async likePost(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    const numericUserId = Number(userId);
    const post = { id: Number(id) } as Post;

    const result = await this.interactionsService.likePost(numericUserId, post);

    return {
      likes_count: 1,
      message: result.wasNew ? 'Liked' : 'Already liked',
    };
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const numericId = Number(id);
    const post = await this.postsService.findOneWithCounters(numericId);

    if (!post) {
      return { message: 'Post not found' };
    }

    return post;
  }

  @Get()
  async listPosts() {
    const page = 1;
    const limit = 10;

    const posts = await this.postsService.findAll({ page, limit });
    const total = await this.postsService.count();

    return {
      data: posts,
      page,
      limit,
      total,
    };
  }
}
