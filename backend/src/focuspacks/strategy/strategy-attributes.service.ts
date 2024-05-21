import {
  AutoreplyContentStrategy,
  AutoreplyTimingStrategy,
  DeliveryStrategy,
  MessageContentStrategy,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateStrategyAttributeServiceInput,
  StrategyAttributeInputsTypes,
  StrategyModelAttribute,
} from './strategy-attributes.service.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StrategyAttributesService {
  static readonly DEFAULT_STRATEGIES: {
    messageContentStrategy: 'STATIC';
    autoreplyContentStrategy: 'STATIC';
    autoreplyTimingStrategy: 'TIMED';
    deliveryStrategy: 'SPECIFIC_TIME';
  };

  constructor(private prismaService: PrismaService) {}

  static getStrategyAttributeEntryFromList(list: any[], name: string) {
    const attribute = list.find((attr) => attr?.key === name);
    return attribute ?? null;
  }

  async getDefaultStrategyMap() {
    return {
      messageContentStrategy:
        await this.prismaService.getFirstEntityByName<MessageContentStrategy>(
          'messageContentStrategy',
          'STATIC',
        ),
      autoreplyContentStrategy:
        await this.prismaService.getFirstEntityByName<AutoreplyContentStrategy>(
          'autoreplyContentStrategy',
          'STATIC',
        ),
      autoreplyTimingStrategy:
        await this.prismaService.getFirstEntityByName<AutoreplyTimingStrategy>(
          'autoreplyTimingStrategy',
          'TIMED',
        ),
      deliveryStrategy:
        await this.prismaService.getFirstEntityByName<DeliveryStrategy>(
          'deliveryStrategy',
          'SPECIFIC_TIME',
        ),
    };
  }

  async getStrategyAttribute(
    dropId: number,
    prismaModelAttribute: StrategyModelAttribute,
  ) {
    switch (prismaModelAttribute) {
      case StrategyModelAttribute.MessageContentStrategyAttribute:
        return await this.prismaService[prismaModelAttribute].findMany({
          where: {
            focusDropId: dropId,
          },
        });

      case StrategyModelAttribute.AutoreplyContentStrategyAttribute:
        return await this.prismaService[prismaModelAttribute].findMany({
          where: {
            focusDropId: dropId,
          },
        });

      case StrategyModelAttribute.AutoreplyTimingStrategyAttribute:
        return await this.prismaService[prismaModelAttribute].findMany({
          where: {
            focusDropId: dropId,
          },
        });

      case StrategyModelAttribute.DeliveryStrategyAttribute:
        return await this.prismaService[prismaModelAttribute].findMany({
          where: {
            focusDropId: dropId,
          },
        });
      default:
        throw new Error('Invalid prisma model attribute');
    }
  }

  async getAllStrategyAttributes(dropId: number) {
    const attributes = await Promise.all(
      Object.values(StrategyModelAttribute).map(async (attribute) => ({
        [attribute]: await this.getStrategyAttribute(dropId, attribute),
      })),
    );
    return Object.assign({}, ...attributes);
  }

  async createStrategyAttribute<T extends StrategyAttributeInputsTypes>(
    payload: CreateStrategyAttributeServiceInput<T>,
    prismaModel: keyof PrismaService,
  ) {
    return (this.prismaService[prismaModel] as any).create({
      data: {
        ...payload.data,
        FocusDrop: {
          connect: {
            id: payload.dropId,
          },
        },
      },
    });
  }
}
