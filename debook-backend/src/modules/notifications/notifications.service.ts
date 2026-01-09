import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue
  ) {}

  async notifyLike(userId: number, postId: number) {
    console.log(`[Notification] User ${userId} liked post ${postId}`);
  }
}
