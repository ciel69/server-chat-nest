import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';

import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';
import { Message, Channel } from './typedefs';
import { ChatService } from './chat.service';
import { UserService } from 'modules/user/user.service';

const pubSub = new PubSub();

@Resolver('Message')
export class ChatResolvers {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {
  }

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

  @Query('getChannels')
  // @UseGuards(GqlAuthGuard)
  async getChannels(): Promise<Channel[]> {
    return await this.chatService.findAll();
  }

  @Query('getCurrentUserChannels')
  // @UseGuards(GqlAuthGuard)
  async getCurrentUserChannels(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<any> {
    return await this.userService.findOneById(id);
  }

  @Query('getChannel')
  // @UseGuards(GqlAuthGuard)
  async getChannel(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<Message> {
    return await this.chatService.getChannel(id);
  }

  @Mutation('createChannel')
  // @UseGuards(GqlAuthGuard)
  async createChannel(
    @Args('uid', ParseIntPipe)
      uid: number,
  ): Promise<Channel> {
    const newChannel = await this.chatService.createChannel(uid);

    pubSub.publish('subscribeChannel', { subscribeChannel: newChannel, uid });

    return newChannel;
  }

  @Mutation('createMessage')
  // @UseGuards(GqlAuthGuard)
  async create(@Args('createChatInput') args): Promise<Message> {
    if (args) {
      const createdMessage = await this.chatService.create(args);
      const channel = await this.chatService.getChannel(args.channelId);
      pubSub.publish('messageAdded', { messageAdded: {...createdMessage, channel}, channelId: args.channelId });
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

  @Subscription('subscribeChannel')
  subscribeChannel() {
    return {
      subscribe: withFilter(
        () => pubSub.asyncIterator('subscribeChannel'),
        (payload, variables) => {
          return +payload.uid === +variables.uid;
        },
      ),
    };
  }
}
