import { Module } from '@nestjs/common';
import { ChatResolvers } from './chat.resolvers';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [ChatService, UserService, ChatResolvers],
})
export class ChatModule {}
