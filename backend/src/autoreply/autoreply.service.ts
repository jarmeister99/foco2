import { Injectable } from '@nestjs/common';
import { IMessage } from '../message-receiver/message-receiver.service';
import { FocusDrop, User } from '@prisma/client';
import { FocusDropsService } from '../focuspacks/focus-drops/focus-drops.service';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class AutoreplyService {
  constructor(
    private focusDropsService: FocusDropsService,
    private prismaService: PrismaService,
    // private twilioService: TwilioService,
  ) {}

  @Cron('45 * * * * *')
  async handleAutoreplyJobs() {
    const jobsToSend = await this.prismaService.autoreplyJob.findMany({
      where: {
        sendAt: {
          lte: new Date(),
        },
      },
    });
    for (const job of jobsToSend) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: job.userId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const { contentStrategy, contentAttributes } =
        await this.focusDropsService.getDropAutoreplyStrategyAndAttributes(
          job.focusDropId,
        );
      switch (contentStrategy.name) {
        case 'STATIC':
          const bodyContentAttribute = contentAttributes.find(
            (attribute) => attribute.key === 'body',
          );
          const mediaUrlContentAttribute = contentAttributes.find(
            (attribute) => attribute.key === 'mediaUrl',
          );
          if (!bodyContentAttribute && !mediaUrlContentAttribute) {
            throw new Error('Body and media URL not found');
          }
        // await this.twilioService.sendSms(
        //   user.number,
        //   bodyContentAttribute?.value || '',
        //   mediaUrlContentAttribute?.value || '',
        // );
        default:
          throw new Error(`Content strategy ${contentStrategy.name} not found`);
      }
    }
  }

  async dispatchAutoreplyJob(
    message: IMessage,
    userId: number,
    dropId: number,
  ) {
    const { timingStrategy, timingAttributes } =
      await this.focusDropsService.getDropAutoreplyStrategyAndAttributes(
        dropId,
      );

    switch (timingStrategy.name) {
      case 'TIMED':
        const timingAttribute = timingAttributes.find(
          (attribute) => attribute.key === 'delayMinutes',
        );
        if (!timingAttribute) {
          throw new Error('Delay minutes not found');
        }
        const sendAt = new Date(
          Date.now() + Number(timingAttribute.value) * 60 * 1000,
        );
        await this.prismaService.autoreplyJob.create({
          data: {
            userId,
            focusDropId: dropId,
            sendAt,
            userText: message.Body,
          },
        });
      default:
        throw new Error(`Timing strategy ${timingStrategy.name} not found`);
    }
  }
}
