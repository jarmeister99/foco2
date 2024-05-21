import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageReceiverService } from '../message-receiver/message-receiver.service';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;

  constructor(
    private configService: ConfigService,
    private messageReceiverService: MessageReceiverService,
  ) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.phoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
  }

  sendSms(to: string, body: string) {
    const client = new Twilio(this.accountSid, this.authToken);
    return client.messages.create({
      body,
      from: this.phoneNumber,
      to,
    });
  }

  receiveSmsWebhook(data: any) {
    this.messageReceiverService.handleReceivedMessage(data);
    return Promise.resolve({ success: true });
  }
}
