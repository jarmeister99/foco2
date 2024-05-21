import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AddDropServiceInput } from './types/focusdrops.service.types';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FocuspacksService {
  constructor(private prismaService: PrismaService) {}

  create(createFocusPackDto: Prisma.FocusPackageCreateInput) {
    return this.prismaService.focusPackage.create({ data: createFocusPackDto });
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

  async addDropToPack(servicePayload: AddDropServiceInput) {
    return this.prismaService.focusPackage.update({
      where: { id: servicePayload.packId },
      include: {
        drops: {
          include: {
            type: true,
            MessageContentStrategyAttributes: true,
            AutoreplyContentStrategyAttributes: true,
            AutoreplyTimingStrategyAttributes: true,
            DeliveryStrategyAttributes: true,
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

  @Cron('45 * * * * *')
  handlePacks() {}

  private getUsersToSend() {
    const now = new Date();
    const hour = now.getHours();

    return this.prismaService.user.findMany({
      where: {
        packStartHour: {
          lte: hour,
        },
      },
    });
  }
}
