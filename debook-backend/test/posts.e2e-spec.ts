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
    const post = await dataSource.getRepository('posts').save({ content: 'Test post', likes_count: 0 });

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

  afterAll(async () => {
    await app.close();
  });
});
