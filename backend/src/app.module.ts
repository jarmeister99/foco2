import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { TwilioModule } from './twilio/twilio.module';
import { ConfigModule } from '@nestjs/config';
import { FocuspacksModule } from './focuspacks/focuspacks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageReceiverModule } from './message-receiver/message-receiver.module';
import { AutoreplyModule } from './autoreply/autoreply.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    UsersModule,
    PrismaModule,
    MessagesModule,
    TwilioModule,
    FocuspacksModule,
    MessageReceiverModule,
    AutoreplyModule,
    PointsModule,
  ],
})
export class AppModule {}
