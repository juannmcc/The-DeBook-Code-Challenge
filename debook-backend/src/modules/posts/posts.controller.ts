import { Controller, Post as PostRoute, Param, Headers, Get, Query } from '@nestjs/common';
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

    const { like, wasNew } = await this.interactionsService.likePost(numericUserId, post);

    if (!wasNew) {
      return { likes_count: 1, message: 'Already liked' };
    }

    return { likes_count: 1, message: 'Liked' };
  }

  @Get()
  async getPosts(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);

    const result = await this.postsService.findAll(numericPage, numericLimit);
    return {
      page: numericPage,
      limit: numericLimit,
      total: result.total,
      data: result.data,
    };
  }
}
