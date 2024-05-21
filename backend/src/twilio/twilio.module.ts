import { Global, Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioController } from './twilio.controller';
import { MessageReceiverModule } from '../message-receiver/message-receiver.module';

@Global()
@Module({
  providers: [TwilioService],
  exports: [TwilioService],
  controllers: [TwilioController],
  imports: [MessageReceiverModule],
})
export class TwilioModule {}
