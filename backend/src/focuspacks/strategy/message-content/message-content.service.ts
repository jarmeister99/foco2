import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MessageContentService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getStaticMessageContentStrategy() {
    return this.prismaService.messageContentStrategy.findFirst({
      where: {
        name: {
          equals: 'static',
          mode: 'insensitive', // This accounts for case-insensitive matching
        },
      },
    });
  }

  async attachStaticMessageContentStrategy(
    dropId: number,
    data: { body: string; mediaUrl: string },
  ) {
    const staticStrategy = await this.getStaticMessageContentStrategy();
    if (!staticStrategy) {
      throw new Error('Static message content strategy not found');
    }

    await this.prismaService.messageContentStrategyAttribute.create({
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
    if (data.mediaUrl != undefined) {
      await this.prismaService.messageContentStrategyAttribute.create({
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
