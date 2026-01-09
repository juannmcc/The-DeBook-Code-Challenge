import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column, CreateDateColumn } from 'typeorm';
import { Post } from '@/modules/posts/post.entity';

@Entity('post_likes')
@Unique(['post', 'user_id'])
export class PostLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post!: Post;

  @Column()
  user_id!: number;

  @CreateDateColumn()
  created_at!: Date;
}