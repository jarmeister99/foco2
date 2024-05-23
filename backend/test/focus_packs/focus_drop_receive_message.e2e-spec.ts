import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FocuspacksService } from '../../src/focuspacks/focuspacks.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { initializeTestApp } from '../test-setup';
import { FocusPackage } from '@prisma/client';

describe('Focus pack and drop user interaction', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await initializeTestApp();
    prismaService = app.get(PrismaService);
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create and populate a focus pack', async () => {
    const response = await request(app.getHttpServer())
      .post('/focuspacks')
      .send({
        name: 'Pilot Pack',
        description: 'This is the first focus pack!!!',
        startAtDate: new Date(2000, 11, 1),
      })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/focuspacks/${response.body.id}/drops/create/prompt`)
      .send({
        messageToSend: {
          body: 'Hello',
        },
        autoreply: {
          body: 'Cool autoreply',
        },
      })
      .expect(201);
  });
});
