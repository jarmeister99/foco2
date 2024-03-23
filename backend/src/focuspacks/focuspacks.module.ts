import { Module } from '@nestjs/common';
import { FocuspacksService } from './focuspacks.service';
import { FocuspacksController } from './focuspacks.controller';
import { StrategyAttributesService } from './strategy-attributes/strategy-attributes.service';

@Module({
  controllers: [FocuspacksController],
  providers: [FocuspacksService, StrategyAttributesService],
})
export class FocuspacksModule {}
