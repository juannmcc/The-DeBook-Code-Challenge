import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsService } from './interactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from './post-like.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('InteractionsService', () => {
  let service: InteractionsService;
  let repo: Repository<PostLike>;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionsService,
        { provide: getRepositoryToken(PostLike), useValue: mockRepo },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<InteractionsService>(InteractionsService);
    repo = module.get<Repository<PostLike>>(getRepositoryToken(PostLike));
  });

  it('should like a post if not already liked', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue({ user_id: 1, post: { id: 1 } });
    mockRepo.save.mockResolvedValue({ user_id: 1, post: { id: 1 } });

    const result = await service.likePost(1, { id: 1 } as any);
    expect(result.like).toBeDefined();
    expect(result.wasNew).toBe(true);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('post.liked', { userId: 1, postId: 1 });
  });

  it('should not create duplicate like', async () => {
    mockRepo.findOne.mockResolvedValue({ user_id: 1, post: { id: 1 } });
    const result = await service.likePost(1, { id: 1 } as any);
    expect(result.like).toBeDefined();
    expect(result.wasNew).toBe(false);
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });
});
