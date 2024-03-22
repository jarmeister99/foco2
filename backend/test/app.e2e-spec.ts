import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from './test-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
  it('/prisma/health (GET)', () => {
    return request(app.getHttpServer()).get('/prisma/health').expect(200);
  });
});
