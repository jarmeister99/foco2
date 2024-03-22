import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Prisma } from '@prisma/client';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: Prisma.MessageCreateInput) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(@Query() where: Prisma.MessageWhereInput) {
    return this.messagesService.findAll(where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: Prisma.MessageUpdateInput,
  ) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
