import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoreplyContentService } from '../strategy/autoreply-content/autoreply-content';
import { AutoreplyTimingService } from '../strategy/autoreply-timing/autoreply-timing.service';
import { MessageContentService } from '../strategy/message-content/message-content.service';
import { StrategyAttributesService } from '../strategy/strategy-attributes.service';
import { FocusDrop, FocusDropType } from '@prisma/client';

export type DropType = 'prompt' | 'nudge' | 'reflection';
export function isDropType(value: string): value is DropType {
  return ['prompt', 'nudge', 'reflection'].includes(value);
}

@Injectable()
export class FocusDropsService {
  constructor(
    private prismaService: PrismaService,
    private messageContentService: MessageContentService,
    private autoreplyContentService: AutoreplyContentService,
    private autoreplyTimingService: AutoreplyTimingService,
    private strategyAttributesService: StrategyAttributesService,
  ) {}

  async indicateUserResponse(dropId: number, userId: number) {
    const drop = await this.prismaService.focusDrop.update({
      where: { id: dropId },
      data: {
        responders: {
          connect: { id: userId },
        },
      },
      include: {
        responders: true, // Optionally include to verify or use in further logic
      },
    });
    return drop;
  }

  async getDropAutoreplyStrategyAndAttributes(dropId: number) {
    const drop = await this.prismaService.focusDrop.findUnique({
      where: { id: dropId },
      include: {
        AutoreplyTimingStrategy: true,
        AutoreplyTimingStrategyAttributes: true,
        AutoreplyContentStrategy: true,
        AutoreplyContentStrategyAttributes: true,
      },
    });
    return {
      timingStrategy: drop.AutoreplyTimingStrategy,
      timingAttributes: drop.AutoreplyTimingStrategyAttributes,
      contentStrategy: drop.AutoreplyContentStrategy,
      contentAttributes: drop.AutoreplyContentStrategyAttributes,
    };
  }

  async getLatestDropForUserWithoutResponse(
    userId: number,
  ): Promise<FocusDrop | null> {
    return null;
  }

  async createDropInPack(
    packId: number,
    type: DropType,
    payload: {
      messageContent: {
        body: string;
        mediaUrl: string;
      };
      autoreplyContent?: {
        body: string;
        mediaUrl: string;
      };
    },
  ) {
    const drop = await this.createDropInFocusPack(packId, type);

    await Promise.all([
      this.messageContentService.attachStaticMessageContentStrategy(
        drop.id,
        payload.messageContent,
      ),

      // if the drop has autoreply content, attach the autoreply content and timing
      ...(payload.autoreplyContent
        ? [
            this.autoreplyContentService.attachStaticAutoreplyContentStrategy(
              drop.id,
              payload.autoreplyContent,
            ),
            this.autoreplyTimingService.attachImmediateAutoreplyTimingStrategy(
              drop.id,
            ),
          ]
        : []),
    ]);

    // get the updated drop after the addition of all the attributes
    const updatedDrop = await this.prismaService.focusDrop.findUnique({
      where: { id: drop.id },
      include: {
        FocusPackage: true,
        MessageContentStrategy: true,
        MessageContentStrategyAttributes: true,
        AutoreplyContentStrategy: true,
        AutoreplyContentStrategyAttributes: true,
        AutoreplyTimingStrategy: true,
        AutoreplyTimingStrategyAttributes: true,
        DeliveryStrategy: true,
        DeliveryStrategyAttributes: true,
        type: true,
      },
    });

    return updatedDrop;
  }

  private async createDropInFocusPack(
    packId: number,
    type: DropType,
    strategyTypes?: any,
  ) {
    const dropType =
      await this.prismaService.getFirstEntityByName<FocusDropType>(
        'focusDropType',
        type,
      );

    // Provide default if strategies arent provided
    const strategyTypesMap =
      strategyTypes ??
      (await this.strategyAttributesService.getDefaultStrategyMap());

    return await this.prismaService.focusDrop.create({
      data: {
        type: {
          connect: {
            id: dropType.id,
          },
        },
        MessageContentStrategy: {
          connect: {
            id: strategyTypesMap.messageContentStrategy.id,
          },
        },
        AutoreplyContentStrategy: {
          connect: {
            id: strategyTypesMap.autoreplyContentStrategy.id,
          },
        },
        AutoreplyTimingStrategy: {
          connect: {
            id: strategyTypesMap.autoreplyTimingStrategy.id,
          },
        },
        DeliveryStrategy: {
          connect: {
            id: strategyTypesMap.deliveryStrategy.id,
          },
        },
        FocusPackage: {
          connect: {
            id: packId,
          },
        },
      },
    });
  }
}
