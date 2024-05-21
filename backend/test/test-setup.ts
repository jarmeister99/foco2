import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

export let app: INestApplication;

export const initializeTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  moduleFixture.useLogger(new ConsoleLogger());
  app = moduleFixture.createNestApplication();
  return await app.init();
};
