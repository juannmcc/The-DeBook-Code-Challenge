import { Controller, Post as PostRoute, Param, Headers } from '@nestjs/common';
import { InteractionsService } from '../interactions/interactions.service';
import { Post } from './post.entity';

@Controller('v1/posts')
export class PostsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @PostRoute(':id/like')
  async likePost(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    const numericUserId = Number(userId);
    const post = { id: Number(id) } as Post;

    const result = await this.interactionsService.likePost(numericUserId, post);

    const firstTime = (result as any).wasNew ?? false;

    return {
      likes_count: 1,
      message: firstTime ? 'Liked' : 'Already liked',
    };
  }
}
