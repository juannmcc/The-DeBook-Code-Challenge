import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  @Process('post-like')
  async handlePostLike(job: Job<{ userId: number; postId: number }>) {
    const { userId, postId } = job.data;
    console.log(`[Notification] User ${userId} liked post ${postId}`);
  }
}