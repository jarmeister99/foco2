import { Module } from '@nestjs/common';
import { FocuspacksService } from './focuspacks.service';
import { FocuspacksController } from './focuspacks.controller';
import { StrategyAttributesService } from './strategy/strategy-attributes.service';
import { AutoreplyContentService } from './strategy/autoreply-content/autoreply-content';
import { MessageContentService } from './strategy/message-content/message-content.service';
import { AutoreplyTimingService } from './strategy/autoreply-timing/autoreply-timing.service';
import { DeliveryService } from './strategy/delivery/delivery.service';
import { FocusDropsService } from './focus-drops/focus-drops.service';

@Module({
  controllers: [FocuspacksController],
  providers: [
    FocuspacksService,
    FocusDropsService,
    StrategyAttributesService,
    MessageContentService,
    AutoreplyContentService,
    AutoreplyTimingService,
    DeliveryService,
  ],
  exports: [FocuspacksService, FocusDropsService],
})
export class FocuspacksModule {}
