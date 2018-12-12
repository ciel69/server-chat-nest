import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { Controller, Session, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtToken } from './interfaces/auth.interfaces';

@Controller('Auth')
@Resolver('Auth')
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Query('login')
  public async login( @Args('login') login: string, @Args('password') password: string, @Context() context): Promise<JwtToken> {
    const { session } = context.req;
    const token = await this.authService.createToken({
      login,
    });

    session.user = {
      login,
      ...token,
    };

    return token;
  }
}
