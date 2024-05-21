import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FocuspacksService } from './focuspacks.service';
import { Prisma } from '@prisma/client';
import { AddDropToPackDto } from './dtos/add-drop-to-pack.dto';
import {
  AddDropServiceInput,
  DropType,
} from './types/focusdrops.service.types';
import {
  FocusDropsService,
  isDropType,
} from './focus-drops/focus-drops.service';

@Controller('focuspacks')
export class FocuspacksController {
  constructor(
    private readonly focuspacksService: FocuspacksService,
    private readonly dropsService: FocusDropsService,
  ) {}

  @Post()
  createFocusPack(@Body() createFocusPackDto: Prisma.FocusPackageCreateInput) {
    return this.focuspacksService.create(createFocusPackDto);
  }

  @Post(':packId/users/:userId')
  addUserToPack(
    @Param('packId', ParseIntPipe) packId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.focuspacksService.addUserToPack(userId, packId);
  }

  @Delete(':focusPackId/users/:userId')
  removeUserFromPack(
    @Param('focusPackId', ParseIntPipe) focusPackId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.focuspacksService.removeUserFromPack(userId, focusPackId);
  }

  @Post(':packId/drops/create/:type')
  createDropInPack(
    @Param('packId', ParseIntPipe) packId: number,
    // TODO: should use ParseEnumPipe here
    @Param('type') type: string,
    @Body()
    bodyParams: {
      messageToSend: {
        body: string;
        mediaUrl: string;
      };
      autoreply?: {
        body: string;
        mediaUrl: string;
      };
    },
  ) {
    if (!isDropType(type)) {
      throw new BadRequestException('Invalid drop type');
    }
    return this.dropsService.createDropInPack(packId, type, {
      messageContent: {
        body: bodyParams.messageToSend.body,
        mediaUrl: bodyParams.messageToSend.mediaUrl,
      },
      ...(bodyParams.autoreply
        ? { autoreplyContent: bodyParams.autoreply }
        : {}),
    });
  }

  @Post('packId/drops/add')
  addDropToPack(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() addDropToPackDto: AddDropToPackDto,
  ) {
    const servicePayload: AddDropServiceInput = {
      dropId: addDropToPackDto.dropId,
      packId: packId,
    };
    return this.focuspacksService.addDropToPack(servicePayload);
  }
}
