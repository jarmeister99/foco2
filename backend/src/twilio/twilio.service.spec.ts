import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from './twilio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('TwilioService', () => {
  let service: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [TwilioService],
    }).compile();

    service = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
