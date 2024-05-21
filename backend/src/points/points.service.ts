import { Injectable } from '@nestjs/common';
import { IMessage } from '../message-receiver/message-receiver.service';

@Injectable()
export class PointsService {
  async handleResponsePoints(
    message: IMessage,
    userId: number,
    dropId: number,
  ) {}
}
