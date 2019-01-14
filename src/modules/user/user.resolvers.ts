import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { User } from './typedefs';
import { UserService } from './user.service';

import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';

const pubSub = new PubSub();

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async allUsers() {
    return await this.userService.findAll();
  }

  @Query('user')
  async findOneById(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Query('currentUser')
  currentUser(@Context() context) {
    const { session } = context.req;
    return session.user;
  }

  @Mutation('createUser')
  async create(@Args('createChatInput') args): Promise<User> {
    if (args) {
      const createdMessage = await this.userService.create(args);
      pubSub.publish('userCreated', { userCreated: createdMessage });
      return createdMessage;
    }

    return Promise.reject(new Error('Null arguments'));
  }

  @Subscription('userCreated')
  userCreated() {
    return {
      subscribe: () => pubSub.asyncIterator('userCreated'),
    };
  }
}
