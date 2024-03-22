import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from '../test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TwilioService } from '../../src/twilio/twilio.service';

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

  it('should receive a message', async () => {
    const response = await request(app.getHttpServer())
      .post('/twilio/webhook')
      .send({
        Body: 'Hello, World!',
        From: 'Test Sender Phone Number',
        To: 'Test Receiver Phone Number',
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });
  it.skip('should be able to send a message', async () => {
    // get access to the twilio service
    const twilioService = app.get(TwilioService);

    // send a message
    const response = await twilioService.sendSms(
      '+16196037721',
      'Hello, Jared!',
    );

    expect(response.to).toBe('+16196037721');
    expect(response.body).toBe('Hello, Jared!');
  });
});
