import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from '../test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TwilioService } from '../../src/twilio/twilio.service';

describe('DB seed (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('focus drop types', () => {
    it("should have the 'prompt' focus drop type", async () => {
      const prismaService = app.get(PrismaService);
      const focusDropType = await prismaService.focusDropType.findMany({
        where: { name: { equals: 'prompt', mode: 'insensitive' } },
      });
      expect(focusDropType).toHaveLength(1);
    });
    it("should have the 'nudge' focus drop type", async () => {
      const prismaService = app.get(PrismaService);
      const focusDropType = await prismaService.focusDropType.findMany({
        where: { name: { equals: 'nudge', mode: 'insensitive' } },
      });
      expect(focusDropType).toHaveLength(1);
    });
    it("should have the 'reflection' focus drop type", async () => {
      const prismaService = app.get(PrismaService);
      const focusDropType = await prismaService.focusDropType.findMany({
        where: { name: { equals: 'reflection', mode: 'insensitive' } },
      });
      expect(focusDropType).toHaveLength(1);
    });
  });
  describe('message content strategies', () => {
    it('should have the "static" message content strategy', async () => {
      const prismaService = app.get(PrismaService);
      const messageContentStrategy =
        await prismaService.messageContentStrategy.findMany({
          where: { name: { equals: 'static', mode: 'insensitive' } },
        });
      expect(messageContentStrategy).toHaveLength(1);
      expect(messageContentStrategy[0].strategyAttributeKeys).toEqual(
        expect.arrayContaining(['body', 'mediaUrl']),
      );
    });
    it('should have the "templated" message content strategy', async () => {
      const prismaService = app.get(PrismaService);
      const messageContentStrategy =
        await prismaService.messageContentStrategy.findMany({
          where: { name: { equals: 'templated', mode: 'insensitive' } },
        });
      expect(messageContentStrategy).toHaveLength(1);
      expect(messageContentStrategy[0].strategyAttributeKeys).toEqual(
        expect.arrayContaining(['bodyTemplate', 'mediaUrl']),
      );
    });
  });
  describe('autoreply content strategies', () => {
    it('should have the "static" autoreply content strategy', async () => {
      const prismaService = app.get(PrismaService);
      const autoreplyContentStrategy =
        await prismaService.autoreplyContentStrategy.findMany({
          where: { name: { equals: 'static', mode: 'insensitive' } },
        });
      expect(autoreplyContentStrategy).toHaveLength(1);
      expect(autoreplyContentStrategy[0].strategyAttributeKeys).toEqual(
        expect.arrayContaining(['body', 'mediaUrl']),
      );
    });
    it('should have the "templated" autoreply content strategy', async () => {
      const prismaService = app.get(PrismaService);
      const autoreplyContentStrategy =
        await prismaService.autoreplyContentStrategy.findMany({
          where: { name: { equals: 'templated', mode: 'insensitive' } },
        });
      expect(autoreplyContentStrategy).toHaveLength(1);
      expect(autoreplyContentStrategy[0].strategyAttributeKeys).toEqual(
        expect.arrayContaining(['bodyTemplate', 'mediaUrl']),
      );
    });
  });
  describe('autoreply timing strategies', () => {
    it('should have the "timed" autoreply timing strategy', async () => {
      const prismaService = app.get(PrismaService);
      const autoreplyTimeWindowStrategy =
        await prismaService.autoreplyTimingStrategy.findMany({
          where: { name: { equals: 'timed', mode: 'insensitive' } },
        });
      expect(autoreplyTimeWindowStrategy).toHaveLength(1);
      expect(autoreplyTimeWindowStrategy[0].strategyAttributeKeys).toEqual(
        expect.arrayContaining(['delayMinutes']),
      );
    });
  });
});
