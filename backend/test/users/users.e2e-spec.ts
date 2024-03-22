import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from '../test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestApp();
    const prismaService = app.get(PrismaService);
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get all users', async () => {
    await request(app.getHttpServer()).get('/users').expect(200);
  });

  describe('should be able to create, get, update, and then delete a user', () => {
    let id;
    beforeEach(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    it('should be able to create a user', async () => {
      const user = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          number: '+15551236789',
        })
        .expect(201);
      expect(user.body.name).toEqual('Test User');
      expect(user.body.number).toEqual('+15551236789');
      id = user.body.id;
    });
    it('should be able to get a user by id', async () => {
      const user = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(200);
      expect(user.body.name).toEqual('Test User');
      expect(user.body.number).toEqual('+15551236789');
    });
    it('should be able to update a user by id', async () => {
      const user = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({
          name: 'Test User Bob',
        })
        .expect(200);
      expect(user.body.name).toEqual('Test User Bob');
      expect(user.body.number).toEqual('+15551236789');
    });
    it('should be able to set a drop time on a user using a date object', async () => {
      const user = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({
          dropTime: new Date('2022-01-01T00:00:00Z'),
        })
        .expect(200);
      expect(new Date(user.body.dropTime)).toEqual(
        new Date('2022-01-01T00:00:00Z'),
      );
    });
    it('should be able to set a drop time on a user using a date string', async () => {
      const user = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({
          dropTime: '2022-01-01T00:00:00Z',
        })
        .expect(200);
      expect(new Date(user.body.dropTime)).toEqual(
        new Date('2022-01-01T00:00:00Z'),
      );
    });
    it('should be able to delete a user by id', async () => {
      await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);
    });
  });

  describe('should be able to find users by attributes', () => {
    beforeAll(async () => {
      const prismaService = app.get(PrismaService);
      await prismaService.user.createMany({
        data: [
          {
            name: 'Test User 1',
            number: '+fakenumber',
          },
          {
            name: 'Test User 2',
            number: '+fakenumber',
          },
          {
            name: 'Test User 3',
            number: '+15554449999',
          },
        ],
      });
    });
    afterAll(async () => {
      const prismaService = app.get(PrismaService);
      await prismaService.user.deleteMany();
    });
    it('should be able to find users by number', async () => {
      const users = await request(app.getHttpServer())
        .get('/users?number=%2Bfakenumber')
        .expect(200);
      expect(users.body.length).toEqual(2);
    });
  });
});
