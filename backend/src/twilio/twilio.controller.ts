import { Body, Controller, Post } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(private twilioService: TwilioService) {}

  @Post('webhook')
  receiveSmsWebhook(@Body() data: any) {
    return this.twilioService.receiveSmsWebhook(data);
  }
}
