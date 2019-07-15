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
    @Args('usersId')
      usersId: number[],
  ): Promise<Channel> {
    const newChannel = await this.chatService.createChannel(usersId);

    pubSub.publish('subscribeUser', { subscribeUser: newChannel, usersId, type: 'channel' });

    return newChannel;
  }

  @Mutation('createMessage')
  // @UseGuards(GqlAuthGuard)
  async create(@Args('createChatInput') args): Promise<Message> {
    if (args) {
      const createdMessage = await this.chatService.create(args);
      pubSub.publish('subscribeUser',
        {
          subscribeUser: {
            message: {
              ...createdMessage,
              channel: {id: args.channelId},
            },
            type: 'message',
          },
          channelId: args.channelId,
          type: 'message',
        });
      return createdMessage;
    }

    return Promise.reject(new Error('Null arguments'));
  }

  // @Subscription('messageAdded', {
  //   filter: (payload: any, variables: any) =>
  //     payload.channelId === variables.channelId,
  // })
  // messageAdded() {
  //   return pubSub.asyncIterator('messageAdded');
  // }

  @Subscription('subscribeUser', {
    filter: (payload: any, variables: any) => {
      if (payload.type === 'channel') {
        return payload.usersId && Array.isArray(payload.usersId)
          ? payload.usersId.includes(+variables.uid)
          : (+variables.uid === +payload.usersId);
      }
      return payload.channelId === variables.channelId;
    },
  })
  subscribeUser() {
    return pubSub.asyncIterator('subscribeUser');
  }
}
