import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatResolvers } from 'modules/chat/chat.resolvers';
import { ChatService } from 'modules/chat/chat.service';
import { UserService } from 'modules/user/user.service';

import { UserEntity } from 'modules/user/entity/users.entity';
import { DialogEntity } from 'modules/chat/entity/dialog.entity';
import { MessageEntity } from 'modules/chat/entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DialogEntity, MessageEntity])],
  providers: [
    ChatService,
    UserService,
    ChatResolvers,
  ],
})
export class ChatModule {}
