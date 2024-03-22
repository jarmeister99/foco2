import { Module } from '@nestjs/common';
import { FocuspacksService } from './focuspacks.service';
import { FocuspacksController } from './focuspacks.controller';

@Module({
  controllers: [FocuspacksController],
  providers: [FocuspacksService],
})
export class FocuspacksModule {}
