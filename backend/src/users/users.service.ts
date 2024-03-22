import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findAll(userWhereInput?: Prisma.UserWhereInput) {
    return this.prismaService.user.findMany({ where: userWhereInput });
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
