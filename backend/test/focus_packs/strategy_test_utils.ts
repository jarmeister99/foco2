import { FocusDrop } from '@prisma/client';
import { StrategyAttributesService } from '../../src/focuspacks/strategy/strategy-attributes.service';

export function checkStrategyAttribute(
  attributeList: any[],
  name: string,
  expectedValue: string,
  expectedFocusDrop: FocusDrop,
) {
  const attribute = StrategyAttributesService.getStrategyAttributeEntryFromList(
    attributeList,
    name,
  );
  expect(attribute).toBeDefined();
  expect(attribute.value).toBe(expectedValue);
  // make sure the attribute is connected to the drop
  expect(attribute.focusDropId).toEqual(expectedFocusDrop.id);
}
