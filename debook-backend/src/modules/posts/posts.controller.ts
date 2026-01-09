import { Controller, Post, Get, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { InteractionsService } from '../interactions/interactions.service'; // <-- ruta relativa segura
import { UserIdGuard } from '../../common/guards/user-id.guard';
import { Request } from 'express';

interface RequestWithUserId extends Request {
  userId: number;
}

@Controller('v1/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly interactionsService: InteractionsService,
  ) {}

  @UseGuards(UserIdGuard)
  @Post(':id/like')
  async like(@Param('id') id: string, @Req() req: RequestWithUserId) {
    const post = await this.postsService.findOne(Number(id));
    if (!post) throw new NotFoundException('Post not found');

    const like = await this.interactionsService.likePost(req.userId, post);
    if (!like) return { message: 'Already liked', likes_count: post.likes_count };

    await this.postsService.incrementLikes(post);

    return { message: 'Liked', likes_count: post.likes_count };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const post = await this.postsService.findOne(Number(id));
    if (!post) throw new NotFoundException('Post not found');

    return {
      id: post.id,
      content: post.content,
      likes_count: post.likes_count,
      comments_count: 0,
    };
  }
}
