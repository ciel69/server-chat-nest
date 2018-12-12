import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context, GqlExecutionContext } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';
import { RequestContext } from 'modules/request-context';
import { Message } from './typedefs';
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
  async getMessage(@Context() context) {
    const { session } = context.req;
    console.log('getMessage', session);
    // console.log('request', RequestContext.currentRequestContext().request);
    // await CurrentUser();
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
