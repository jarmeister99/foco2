import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from '../test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await initializeTestApp();
    prismaService = app.get(PrismaService);
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get all users', async () => {
    await request(app.getHttpServer()).get('/users').expect(200);
  });

  describe('should be able to create, get, update, and then delete a user', () => {
    afterEach(async () => {
      await prismaService.user.deleteMany();
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
    });
    it('should be able to get a user by id', async () => {
      const userId = (
        await prismaService.user.create({
          data: {
            name: 'Test User',
            number: '+15551236789',
          },
        })
      ).id;

      const fetchedUser = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(fetchedUser.body.name).toEqual('Test User');
      expect(fetchedUser.body.number).toEqual('+15551236789');
    });
    it('should be able to update a user by id', async () => {
      const userId = (
        await prismaService.user.create({
          data: {
            name: 'Test User',
            number: '+15551236789',
          },
        })
      ).id;

      const userToPatch = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({
          name: 'Test User Bob',
        })
        .expect(200);
      expect(userToPatch.body.name).toEqual('Test User Bob');
      expect(userToPatch.body.number).toEqual('+15551236789');
    });
    it('should be able to set drop times on a user', async () => {
      const userId = (
        await prismaService.user.create({
          data: {
            name: 'Test User',
            number: '+15551236789',
          },
        })
      ).id;

      const patchedUser = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({
          packStartHour: 1,
          packEndHour: 2,
        })
        .expect(200);
      expect(patchedUser.body.packStartHour).toEqual(1);
      expect(patchedUser.body.packEndHour).toEqual(2);
    });
    it('should be able to delete a user by id', async () => {
      const userId = (
        await prismaService.user.create({
          data: {
            name: 'Test User',
            number: '+15551236789',
          },
        })
      ).id;

      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
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
