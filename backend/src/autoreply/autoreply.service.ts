import { Injectable } from '@nestjs/common';
import { IMessage } from '../message-receiver/message-receiver.service';
import { FocusDrop, User } from '@prisma/client';
import { FocusDropsService } from '../focuspacks/focus-drops/focus-drops.service';

@Injectable()
export class AutoreplyService {
  constructor(private focusDropsService: FocusDropsService) {}

  dispatchAutoreplyJob(message: IMessage, userId: number, dropId: number) {}
}
