import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';

import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';
import { Message } from './typedefs';
import { ChatService } from './chat.service';

const pubSub = new PubSub();

@Resolver('Message')
export class ChatResolvers {
  constructor(
    private readonly chatService: ChatService,
  ) {}

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

  @Query('getChannel')
  @UseGuards(GqlAuthGuard)
  async getChannel(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<Message> {
    return await this.chatService.getChannel(id);
  }

  @Mutation('createMessage')
  @UseGuards(GqlAuthGuard)
  async create(@Args('createChatInput') args): Promise<Message> {
    if (args) {
      const createdMessage = await this.chatService.create(args);
      pubSub.publish('messageAdded', { messageAdded: createdMessage, channelId: args.channelId });
      return createdMessage;
    }

    return Promise.reject(new Error('Null arguments'));
  }

  @Subscription('messageAdded')
  messageAdded() {
    return {
      subscribe: withFilter(
        () => pubSub.asyncIterator('messageAdded'),
        (payload, variables) => {
          // The `messageAdded` channel includes events for all channels, so we filter to only
          // pass through events for the channel specified in the query
          return payload.channelId === variables.channelId;
        },
      ),
    };
  }
}
