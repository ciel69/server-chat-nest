import { Module } from '@nestjs/common';
import { ChatResolvers } from './chat.resolvers';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, ChatResolvers],
})
export class ChatModule {}