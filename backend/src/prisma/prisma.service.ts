import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      errorFormat: 'pretty',
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async healthCheck() {
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async getFirstEntityByName<T>(
    model: keyof PrismaClient,
    name: string,
  ): Promise<T> {
    if (!Object.keys(this).includes(String(model))) {
      throw new Error(`Model ${String(model)} not found`);
    }
    if (!Object.keys(this[model]).includes('findFirst')) {
      throw new Error(
        `Model ${String(model)} does not have a findFirst method`,
      );
    }
    return (this[model] as any).findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }
}
