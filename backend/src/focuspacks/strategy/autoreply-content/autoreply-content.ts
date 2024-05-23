import { PrismaService } from '../../../prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoreplyContentService {
  constructor(private prismaService: PrismaService) {}

  private async getStaticAutoreplyContentStrategy() {
    return this.prismaService.autoreplyContentStrategy.findFirst({
      where: {
        name: {
          equals: 'static',
          mode: 'insensitive', // This accounts for case-insensitive matching
        },
      },
    });
  }

  async getStrategiesAvailable() {
    return this.prismaService.autoreplyContentStrategy.findMany();
  }

  async getStrategyByName(name: string) {
    return this.prismaService.autoreplyContentStrategy.findUnique({
      where: {
        name,
      },
    });
  }

  async hasValidAutoreplyContentStrategy(dropId: number) {
    const drop = await this.prismaService.focusDrop.findUnique({
      where: {
        id: dropId,
        autoreplyContentStrategyId: {
          not: null,
        },
      },
    });
    return drop?.autoreplyContentStrategyId !== null;
  }

  async attachStaticAutoreplyContentStrategy(
    dropId: number,
    data: { body: string; mediaUrl: string },
  ) {
    const staticStrategy = await this.getStaticAutoreplyContentStrategy();
    if (!staticStrategy) {
      throw new Error('Static autoreply content strategy not found');
    }

    await this.prismaService.autoreplyContentStrategyAttribute.create({
      data: {
        key: 'body',
        value: data.body,
        FocusDrop: {
          connect: {
            id: dropId,
          },
        },
      },
    });
    if (data.mediaUrl !== undefined) {
      await this.prismaService.autoreplyContentStrategyAttribute.create({
        data: {
          key: 'mediaUrl',
          value: data.mediaUrl,
          FocusDrop: {
            connect: {
              id: dropId,
            },
          },
        },
      });
    }
  }
}
