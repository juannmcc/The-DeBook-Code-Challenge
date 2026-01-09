import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class InteractionsListener {
  @OnEvent('post.liked')
  handlePostLiked(payload: { userId: number; postId: number }) {
    console.log(`[Notification] User ${payload.userId} liked post ${payload.postId}`);
  }
}
