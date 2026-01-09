import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should find a post by id', async () => {
    const post = { id: 1, likes_count: 0 } as Post;
    mockRepo.findOne.mockResolvedValue(post);

    const result = await service.findOne(1);
    expect(result).toEqual(post);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should increment likes', async () => {
    const post = { id: 1, likes_count: 0 } as Post;
    mockRepo.save.mockResolvedValue({ ...post, likes_count: 1 });

    const result = await service.incrementLikes(post);
    expect(result.likes_count).toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...post, likes_count: 1 });
  });

  it('should increment likes by custom value', async () => {
    const post = { id: 1, likes_count: 2 } as Post;
    mockRepo.save.mockResolvedValue({ ...post, likes_count: 5 });

    const result = await service.incrementLikes(post, 3);
    expect(result.likes_count).toBe(5);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...post, likes_count: 5 });
  });
});
