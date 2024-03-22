import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FocuspacksService } from './focuspacks.service';
import { Prisma } from '@prisma/client';
import { AddDropToPackDto } from './dtos/add-drop-to-pack.dto';
import {
  AddDropServiceInput,
  CreatePromptDropServiceInput,
} from './types/focusdrops.service.types';
import {
  CreateDropInPackDto,
  CreatePromptDropInPackDto,
} from './dtos/create-drop-in-pack.dto';

@Controller('focuspacks')
export class FocuspacksController {
  constructor(private readonly focuspacksService: FocuspacksService) {}

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

  @Post(':packId/drops/prompt/create')
  createPromptDropInPack(
    @Param('packId', ParseIntPipe) packId: number,
    @Body() createPromptDropInPackDto: CreatePromptDropInPackDto,
  ) {
    return this.focuspacksService.createDropInPack(
      packId,
      'PROMPT',
      createPromptDropInPackDto,
    );
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
