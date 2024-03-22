import { Test, TestingModule } from '@nestjs/testing';
import { FocuspacksController } from './focuspacks.controller';
import { FocuspacksService } from './focuspacks.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('FocuspacksController', () => {
  let controller: FocuspacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [FocuspacksController],
      providers: [FocuspacksService],
    }).compile();

    controller = module.get<FocuspacksController>(FocuspacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
