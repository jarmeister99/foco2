import { Module } from '@nestjs/common';
import { FocuspacksModule } from '../focuspacks/focuspacks.module';
import { MessageReceiverService } from './message-receiver.service';
import { UsersModule } from '../users/users.module';
import { AutoreplyModule } from '../autoreply/autoreply.module';
import { PointsModule } from '../points/points.module';

@Module({
  providers: [MessageReceiverService],
  imports: [FocuspacksModule, UsersModule, AutoreplyModule, PointsModule],
  exports: [MessageReceiverService],
})
export class MessageReceiverModule {}
