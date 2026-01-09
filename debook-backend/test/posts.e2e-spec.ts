import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.synchronize(true);
  });

  it('should like a post and be idempotent', async () => {
    const post = await dataSource.getRepository('posts').save({
      content: 'Test post',
      likes_count: 0,
    });

    const res1 = await request(app.getHttpServer())
      .post(`/v1/posts/${post.id}/like`)
      .set('x-user-id', '1')
      .expect(201);

    expect(res1.body.likes_count).toBe(1);
    expect(res1.body.message).toBe('Liked');

    const res2 = await request(app.getHttpServer())
      .post(`/v1/posts/${post.id}/like`)
      .set('x-user-id', '1')
      .expect(201);

    expect(res2.body.likes_count).toBe(1);
    expect(res2.body.message).toBe('Already liked');
  });

  it('should list posts with likes_count', async () => {
    const postRepo = dataSource.getRepository('posts');
    await postRepo.save({ content: 'Another post', likes_count: 3, comments_count: 2 });

    const res = await request(app.getHttpServer())
      .get('/v1/posts')
      .expect(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: expect.any(String),
          likes_count: expect.any(Number),
        }),
      ]),
    );

    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 10);
    expect(res.body).toHaveProperty('total', expect.any(Number));
  });

  it('should get a post with likes_count and comments_count', async () => {
    const post = await dataSource.getRepository('posts').save({
      content: 'Another post',
      likes_count: 2,
      comments_count: 5,
    });

    const res = await request(app.getHttpServer())
      .get(`/v1/posts/${post.id}`)
      .expect(200);

    expect(res.body).toEqual({
      id: post.id,
      content: post.content,
      likes_count: 2,
      comments_count: 5,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
