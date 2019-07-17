import { Args, Query, Resolver, Context } from '@nestjs/graphql';

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
  public async login(
    @Args('login') login: string,
    @Args('password') password: string,
    @Args('firstName') firstName: string,
    @Context() context,
  ): Promise<JwtToken> {
    const { session } = context.req;

    try {
      const user = await this.usersService.findOneByLoginAndPassword({
        login,
        firstName,
        password,
      });

      const token = await this.authService.createToken({
        login,
      });

      session.user = {
        ...user,
        ...token,
      };

      return { ...token, ...user, uid: user.id };
    } catch (e) {
      return e;
    }
  }
}
