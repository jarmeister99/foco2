import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FocusDrop, Prisma } from '@prisma/client';
import {
  AddDropServiceInput,
  CreateDropServiceInput,
} from './types/focusdrops.service.types';

@Injectable()
export class FocuspacksService {
  constructor(private prismaService: PrismaService) {}

  create(createMessageDto: Prisma.FocusPackageCreateInput) {
    return this.prismaService.focusPackage.create({ data: createMessageDto });
  }

  addUserToPack(userId: number, packId: number) {
    return this.prismaService.userFocusPackage.create({
      data: {
        userId: userId,
        focusPackageId: packId,
      },
    });
  }

  removeUserFromPack(userId: number, packId: number) {
    return this.prismaService.userFocusPackage.deleteMany({
      where: {
        userId: userId,
        focusPackageId: packId,
      },
    });
  }

  async getLatestFocusPack(
    userId: number,
    include?: Prisma.FocusPackageInclude,
  ) {
    const now = new Date();
    const latestUserFocusPackage =
      await this.prismaService.userFocusPackage.findFirst({
        where: {
          userId: userId,
          focusPackage: {
            startAtDate: {
              lte: now,
            },
          },
        },
        include: {
          focusPackage: true,
          ...include,
        },
        orderBy: {
          focusPackage: {
            startAtDate: 'desc',
          },
        },
      });
    return latestUserFocusPackage?.focusPackage;
  }

  async createDropInPack(packId, servicePayload: CreateDropServiceInput) {
    let createdDrop: FocusDrop;
    switch (servicePayload.type) {
      case 'PROMPT':
        createdDrop = await this.createPromptDrop(servicePayload);
        break;
      case 'NUDGE':
        // createdDrop = await this.createNudgeDrop(servicePayload);
        break;
      case 'REFLECTION':
        // createdDrop = await this.createReflectionDrop(servicePayload);
        break;
      default:
        throw new Error('Invalid focus drop type');
    }
    const addDropServicePayload: AddDropServiceInput = {
      dropId: createdDrop.id,
      packId: packId,
    };
    return await this.addDropToPack(addDropServicePayload);
  }

  async addDropToPack(servicePayload: AddDropServiceInput) {
    return this.prismaService.focusPackage.update({
      where: { id: servicePayload.packId },
      include: {
        drops: {
          include: {
            type: true,
          },
        },
      },
      data: {
        drops: {
          connect: { id: servicePayload.dropId },
        },
      },
    });
  }

  private async createPromptDrop(servicePayload: CreateDropServiceInput) {
    const dropType = await this.prismaService.focusDropType.findFirst({
      where: {
        name: 'PROMPT',
      },
    });
    const defaultMessageContentStrategy =
      await this.prismaService.messageContentStrategy.findFirst({
        where: {
          name: 'STATIC',
        },
      });
    const defaultAutoreplyContentStrategy =
      await this.prismaService.autoreplyContentStrategy.findFirst({
        where: {
          name: 'STATIC',
        },
      });
    const defaultAutoreplyTimingStrategy =
      await this.prismaService.autoreplyTimingStrategy.findFirst({
        where: {
          name: 'TIMED',
        },
      });

    const defaultDeliveryStrategy =
      await this.prismaService.deliveryStrategy.findFirst({
        where: {
          name: 'SPECIFIC_TIME',
        },
      });

    const createdDrop = await this.prismaService.focusDrop.create({
      data: {
        type: {
          connect: {
            id: dropType.id,
          },
        },
        MessageContentStrategy: {
          connect: {
            id: defaultMessageContentStrategy.id,
          },
        },
        AutoreplyContentStrategy: {
          connect: {
            id: defaultAutoreplyContentStrategy.id,
          },
        },
        AutoreplyTimingStrategy: {
          connect: {
            id: defaultAutoreplyTimingStrategy.id,
          },
        },
        DeliveryStrategy: {
          connect: {
            id: defaultDeliveryStrategy.id,
          },
        },
      },
    });
    return createdDrop;
  }
  private createNudgeDrop(servicePayload: CreateDropServiceInput) {}
  private createReflectionDrop(servicePayload: CreateDropServiceInput) {}
}
