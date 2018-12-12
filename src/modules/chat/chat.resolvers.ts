import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';
import { Message } from './typedefs';
import { ChatService } from './chat.service';

const pubSub = new PubSub();

@Resolver('Message')
export class ChatResolvers {
  constructor(private readonly chatService: ChatService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async getMessage(@Context() context) {
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
  @UseGuards(GqlAuthGuard)
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
    return {
      subscribe: () => pubSub.asyncIterator('chatCreated'),
    };
  }
}
