import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  create(createMessageDto: Prisma.MessageCreateInput) {
    return this.prismaService.message.create({ data: createMessageDto });
  }

  findAll(messageWhereInput?: Prisma.MessageWhereInput) {
    return this.prismaService.message.findMany({ where: messageWhereInput });
  }

  findOne(id: number) {
    return this.prismaService.message.findUnique({ where: { id } });
  }

  update(id: number, updateMessageDto: Prisma.MessageUpdateInput) {
    return this.prismaService.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  remove(id: number) {
    return this.prismaService.message.delete({ where: { id } });
  }
}
