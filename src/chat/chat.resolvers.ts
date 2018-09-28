import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Message } from '../graphql.schema';
import { ChatGuard } from './chat.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { rejects } from 'assert';

const pubSub = new PubSub();

@Resolver('Message')
export class ChatResolvers {
  constructor(private readonly chatService: ChatService) {}

  @Query()
  @UseGuards(ChatGuard)
  async getMessage() {
    return await this.chatService.findAll();
  }

  @Query('message')
  async findOneById(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<Message> {
    return await this.chatService.findOneById(id);
  }

  @Mutation('createMessage')
  async create(@Args('createChatInput') args): Promise<Message> {
    if (args) {
      const createdMessage = await this.chatService.create(args);
      pubSub.publish('chatCreated', { chatCreated: createdMessage });
      return createdMessage;
    }

    return Promise.reject(new Error('Null arguments'));
  }

  @Subscription('chatCreated')
  chatCreated() {
    console.log('chatCreated');
    return {
      subscribe: () => pubSub.asyncIterator('chatCreated'),
    };
  }
}