import { Test, TestingModule } from '@nestjs/testing';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('TwilioController', () => {
  let controller: TwilioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [TwilioController],
      providers: [TwilioService],
    }).compile();

    controller = module.get<TwilioController>(TwilioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call receiveSmsWebhook method with the correct parameters', async () => {
    const testData = { Body: 'Hello', From: '+1234567890' };
    const twilioServiceSpy = jest
      .spyOn(controller['twilioService'], 'receiveSmsWebhook')
      .mockImplementation(() => Promise.resolve({ success: true }));

    await controller.receiveSmsWebhook(testData);

    expect(twilioServiceSpy).toHaveBeenCalledWith(testData);
  });
});
