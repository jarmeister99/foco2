import { Injectable } from '@nestjs/common';
import { FocusDropsService } from '../focuspacks/focus-drops/focus-drops.service';
import { UsersService } from '../users/users.service';
import { AutoreplyService } from '../autoreply/autoreply.service';
import { PointsService } from '../points/points.service';

// Dont sue me Apple
export interface IMessage {
  From: string;
  Body: string;
  [key: string]: string;
}

@Injectable()
export class MessageReceiverService {
  constructor(
    private focusDropsService: FocusDropsService,
    private userService: UsersService,
    private autoreplyService: AutoreplyService,
    private pointsService: PointsService,
  ) {}

  private static RESERVED_WORD_HANDLERS: Record<
    string,
    (message: IMessage) => Promise<{ status: string }>
  > = {
    STOP: async (message: IMessage) => {
      return new Promise((resolve) => {
        resolve({ status: 'success' });
      });
    },
    POINTS: async (message: IMessage) => {
      return new Promise((resolve) => {
        resolve({ status: 'success' });
      });
    },
    HELP: async (message: IMessage) => {
      return new Promise((resolve) => {
        resolve({ status: 'success' });
      });
    },
  };

  /**
   * Check to see if the message is a reserved word, for instance STOP, POINTS, etc.
   * If the message is a reserved word, this is the place to enact special business logic.
   * @param message A message received from a Twilio webhook
   * @returns A promise that resolves to an object with the status of the operation and if a reserved word was processed
   */
  private async handleReservedWords(
    message: IMessage,
  ): Promise<{ status: string; processedReservedWord: boolean }> {
    const handler =
      MessageReceiverService.RESERVED_WORD_HANDLERS[message.Body.toUpperCase()];
    if (handler) {
      const { status } = await handler(message);
      return { status, processedReservedWord: true };
    }
    return { status: 'success', processedReservedWord: false };
  }

  /**
   * Handle the drop response
   * @param message A message received from a Twilio webhook
   * @returns A promise that indicates the status of the response handling
   */
  private async handleDropResponse(
    message: IMessage,
  ): Promise<{ status: string; success: boolean }> {
    // Return early if there is no user / drop for this message
    const user = await this.userService.findAll({ number: message.From })[0];
    if (!user) {
      return { status: 'Error: User not found', success: false };
    }
    const drop =
      await this.focusDropsService.getLatestDropForUserWithoutResponse(user.id);
    if (!drop) {
      return { status: 'Error: No drop found', success: false };
    }

    this.focusDropsService.indicateUserResponse(drop.id, user.id);
    this.pointsService.handleResponsePoints(message, user.id, drop.id);
    this.autoreplyService.dispatchAutoreplyJob(message, user.id, drop.id);

    return { status: 'success', success: true };
  }

  async handleReceivedMessage(message: IMessage) {
    // Return early if the message is a reserved word
    const { processedReservedWord } = await this.handleReservedWords(message);
    if (processedReservedWord) {
      return;
    }
    await this.handleDropResponse(message);
  }
}
