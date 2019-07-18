import { ParseIntPipe, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { User } from 'modules/user/typedefs';
import { UserService } from 'modules/user/user.service';

import { AuthService } from 'modules/auth/auth.service';
import { JwtToken } from 'modules/auth/interfaces/auth.interfaces';
import { GqlAuthGuard } from 'modules/auth/guards/GqlAuthGuard';

const pubSub = new PubSub();

@Resolver('User')
export class UserResolvers {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  @Query()
  // @UseGuards(GqlAuthGuard)
  async allUsers() {
    return await this.userService.findAll();
  }

  @Query('user')
  async findOneById(
    @Args('id', ParseIntPipe)
      id: number,
  ): Promise<User> {
    const user = await this.userService.findOneById(id);

    return user;
  }

  @Query('currentUser')
  currentUser(@Context() context) {
    const { session } = context.req;
    return session.user;
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args): Promise<JwtToken> {
    if (args) {
      const createdUser = this.userService.createUser(args);
      const token = this.authService.createToken({
        login: args.login || args.email,
      });
      const promise = await Promise.all([createdUser, token]);
      return { ...promise[0], ...promise[1] };
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
