import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { Controller, Session, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from 'modules/user/user.service';
import { JwtToken } from './interfaces/auth.interfaces';

@Resolver('Auth')
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {
  }

  @Query('login')
  public async login(@Args('login') login: string, @Args('password') password: string, @Context() context): Promise<JwtToken> {
    const { session } = context.req;

    try {
      const user = await this.usersService.findOneByLogin({
        login,
      });

      const token = await this.authService.createToken({
        login,
      });

      session.user = {
        login,
        ...token,
      };

      return { ...token, login, uid: user.id };
    } catch (e) {
      return e;
    }
  }
}
