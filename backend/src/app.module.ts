import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { TwilioModule } from './twilio/twilio.module';
import { ConfigModule } from '@nestjs/config';
import { FocuspacksModule } from './focuspacks/focuspacks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    MessagesModule,
    TwilioModule,
    FocuspacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
