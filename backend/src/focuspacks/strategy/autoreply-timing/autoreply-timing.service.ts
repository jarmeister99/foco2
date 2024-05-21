import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AutoreplyTimingService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getTimedAutoreplyTimingStrategy() {
    return this.prismaService.autoreplyTimingStrategy.findFirst({
      where: {
        name: {
          equals: 'timed',
          mode: 'insensitive', // This accounts for case-insensitive matching
        },
      },
    });
  }

  async attachImmediateAutoreplyTimingStrategy(dropId: number) {
    const timedStrategy = await this.getTimedAutoreplyTimingStrategy();
    if (!timedStrategy) {
      throw new Error('Timed autoreply timing strategy not found');
    }

    await this.prismaService.autoreplyTimingStrategyAttribute.create({
      data: {
        key: 'delayMinutes',
        value: '0',
        FocusDrop: {
          connect: {
            id: dropId,
          },
        },
      },
    });
  }
}
