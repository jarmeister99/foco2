import { Prisma } from '@prisma/client';

export interface CreateStrategyAttributeServiceInput<
  T extends StrategyAttributeInputsTypes,
> {
  dropId: number;
  data: T;
}

export type StrategyAttributeInputsTypes =
  | Prisma.AutoreplyContentStrategyAttributeCreateInput
  | Prisma.MessageContentStrategyAttributeCreateInput
  | Prisma.AutoreplyTimingStrategyAttributeCreateInput
  | Prisma.DeliveryStrategyAttributeCreateInput;

export enum StrategyModelAttribute {
  MessageContentStrategyAttribute = 'messageContentStrategyAttribute',
  AutoreplyContentStrategyAttribute = 'autoreplyContentStrategyAttribute',
  AutoreplyTimingStrategyAttribute = 'autoreplyTimingStrategyAttribute',
  DeliveryStrategyAttribute = 'deliveryStrategyAttribute',
}
