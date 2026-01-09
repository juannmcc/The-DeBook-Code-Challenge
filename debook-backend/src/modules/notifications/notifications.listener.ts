import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsListener {
  @OnEvent('post.liked')
  handlePostLiked(payload: { userId: number; postId: number }) {
    console.log(`[Notification] User ${payload.userId} liked Post ${payload.postId}`);
  }
}