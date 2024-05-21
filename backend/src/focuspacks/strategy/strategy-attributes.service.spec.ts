import { StrategyAttributesService } from './strategy-attributes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StrategyModelAttribute } from './strategy-attributes.service.types';

describe('StrategyAttributesService', () => {
  let service: StrategyAttributesService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    service = new StrategyAttributesService(prismaService);
  });

  describe('getStrategyAttribute', () => {
    it('should return the correct strategy attribute based on the model attribute', async () => {
      jest
        .spyOn(prismaService.messageContentStrategyAttribute, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            key: 'key',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      const result = await service.getStrategyAttribute(
        123,
        StrategyModelAttribute.MessageContentStrategyAttribute,
      );

      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            key: 'key',
            value: 'value',
            focusDropId: 123,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ]),
      );
    });
    it('should throw an error if the strategy attribute does not exist', async () => {
      await expect(
        service.getStrategyAttribute(123, 'foo' as any),
      ).rejects.toThrow('Invalid prisma model attribute');
    });
  });
  describe('getAllStrategyAttributes', () => {
    it('should return all strategy attributes for a focus drop', async () => {
      jest
        .spyOn(prismaService.messageContentStrategyAttribute, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            key: 'messageContent',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      jest
        .spyOn(prismaService.autoreplyContentStrategyAttribute, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            key: 'autoreplyContent',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            key: 'autoreplyContent2',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      jest
        .spyOn(prismaService.deliveryStrategyAttribute, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            key: 'delivery',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      jest
        .spyOn(prismaService.autoreplyTimingStrategyAttribute, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            key: 'autoreplyTiming',
            value: 'value',
            focusDropId: 123,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      const result = await service.getAllStrategyAttributes(123);

      // create an expectation that the result here has a certain key
      const propertiesToCheck = Object.values(StrategyModelAttribute).map(
        (attribute) => attribute,
      );

      propertiesToCheck.forEach((property) => {
        expect(result).toHaveProperty(property);
        expect(result[property].length).toBeGreaterThanOrEqual(1);
      });

      // make sure that autoreplyContentStrategyAttribute has
      // an entry with key = 'autoreplyContent' and another entry with
      // key = 'autoreplyContent2'
      expect(
        result.autoreplyContentStrategyAttribute.length,
      ).toBeGreaterThanOrEqual(2);
      expect(result.autoreplyContentStrategyAttribute).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'autoreplyContent',
          }),
          expect.objectContaining({
            key: 'autoreplyContent2',
          }),
        ]),
      );
    });
  });
});
