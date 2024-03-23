import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateStrategyAttributeServiceInput,
  StrategyAttributeInputsTypes,
  StrategyModelAttribute,
} from './strategy-attributes.service.types';

export class StrategyAttributesService {
  constructor(private prismaService: PrismaService) {}

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
