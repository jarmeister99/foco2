import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from '../test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FocusDrop, FocusPackage, User } from '@prisma/client';
import { FocuspacksService } from '../../src/focuspacks/focuspacks.service';

describe('Pack poller (e2e)', () => {
  let app: INestApplication;
  let focusPacksService: FocuspacksService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await initializeTestApp();
    prismaService = app.get(PrismaService);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('create a focus pack and three drops within it', () => {
    let currentFocusPack: FocusPackage;
    let nudgeDrop: FocusDrop;
    let promptDrop: FocusDrop;
    let reflectionDrop: FocusDrop;

    beforeEach(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    beforeAll(async () => {
      await prismaService.focusPackage.deleteMany();
      await prismaService.focusDrop.deleteMany();
    });

    afterAll(async () => {
      await prismaService.focusPackage.deleteMany();
      await prismaService.focusDrop.deleteMany();
    });

    it('should be able to create a focus pack', async () => {
      const response = await request(app.getHttpServer())
        .post('/focuspacks')
        .send({
          name: 'Pilot Pack',
          description: 'This is the first focus pack!!!',
          startAtDate: new Date(2000, 11, 1),
        })
        .expect(201);
      currentFocusPack = response.body;
    });
    it('should be able to create a prompt focus drop within a focus pack', async () => {
      const response = await request(app.getHttpServer())
        .post(`/focuspacks/${currentFocusPack.id}/drops/create`)
        .send({
          dropType: 'PROMPT',
        })
        .expect(201);
      const modifiedFocusPack = response.body;
      expect(modifiedFocusPack.id).toEqual(currentFocusPack.id);
      expect(modifiedFocusPack.drops.length).toEqual(1);

      // let's make sure the focus drop created is correct
      const createdDrop = modifiedFocusPack.drops[0];

      // make sure the drop is connected to the pack
      expect(createdDrop.focusPackageId).toEqual(currentFocusPack.id);

      // make sure the drop is a prompt
      expect(createdDrop.type.name).toEqual('PROMPT');
    });
  });

  describe('see which pack is the latest for a given user', () => {
    let user: User;
    let currentFocusPack: FocusPackage;
    let olderFocusPack: FocusPackage;
    let futureFocusPack: FocusPackage;
    let originalDate;

    beforeAll(async () => {
      focusPacksService = app.get(FocuspacksService);
      prismaService = app.get(PrismaService);

      // date mocks
      originalDate = global.Date;
      const mockDate = new Date(2011, 11, 5);
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = jest.fn(() => mockDate.getTime());

      // clear out test data
      await prismaService.userFocusPackage.deleteMany();
      await prismaService.user.deleteMany();
      await prismaService.focusPackage.deleteMany();
    });
    afterAll(async () => {
      // reset mocks
      global.Date = originalDate;

      await prismaService.userFocusPackage.deleteMany();
      await prismaService.user.deleteMany();
      await prismaService.focusPackage.deleteMany();
    });
    beforeEach(async () => {
      // Want to allow database to settle
      await new Promise((r) => setTimeout(r, 100));
    });
    it('should be able to create a focus pack', async () => {
      const response = await request(app.getHttpServer())
        .post('/focuspacks')
        .send({
          name: 'Test Pack Please Ignore',
          description: 'This is a test pack ',
          startAtDate: new Date(2000, 11, 1),
        })
        .expect(201);
      currentFocusPack = response.body;
    });
    it('should be able to create an older focus pack', async () => {
      const response = await request(app.getHttpServer())
        .post('/focuspacks')
        .send({
          name: 'Old Pack',
          description: 'This is an old pack',
          startAtDate: new Date(1999, 11, 1),
        })
        .expect(201);
      olderFocusPack = response.body;
    });
    it('should be able to create a future focus pack', async () => {
      const response = await request(app.getHttpServer())
        .post('/focuspacks')
        .send({
          name: 'Future Pack',
          description: 'This is a future pack',
          startAtDate: new Date(2001, 11, 1),
        })
        .expect(201);
      futureFocusPack = response.body;
    });
    it('should be able to create a test user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User Bob',
          number: '+15551236789',
        })
        .expect(201);
      user = response.body;
      expect(user.name).toEqual('Test User Bob');
      expect(user.number).toEqual('+15551236789');
    });
    it('should be able to add a user to focus packs', async () => {
      await request(app.getHttpServer())
        .post(`/focuspacks/${currentFocusPack.id}/users/${user.id}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/focuspacks/${olderFocusPack.id}/users/${user.id}`)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/focuspacks/${futureFocusPack.id}/users/${user.id}`)
        .expect(201);
    });
    it('should be able to get the latest pack for a user', async () => {
      const latestPack = await focusPacksService.getLatestFocusPack(user.id);
      expect(latestPack.id).toEqual(currentFocusPack.id);
    });
    it('should be able to remove a user from a focus pack', async () => {
      await request(app.getHttpServer())
        .delete(`/focuspacks/${currentFocusPack.id}/users/${user.id}`)
        .expect(200);
    });
    it('should be able to get the new latest pack for a user', async () => {
      const latestPack = await focusPacksService.getLatestFocusPack(user.id);
      expect(latestPack.id).toEqual(olderFocusPack.id);
    });
  });
});
