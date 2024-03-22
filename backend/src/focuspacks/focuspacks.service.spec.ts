import { Test, TestingModule } from '@nestjs/testing';
import { FocuspacksService } from './focuspacks.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('FocuspacksService', () => {
  let service: FocuspacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FocuspacksService],
    }).compile();

    service = module.get<FocuspacksService>(FocuspacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
