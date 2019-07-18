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
  ): Promise<JwtToken> {

    try {
      const user = await this.usersService.findOneByLoginAndPassword({
        login,
        firstName,
        password,
      });

      const token = await this.authService.createToken({
        login,
      });

      return { ...token, ...user };
    } catch (e) {
      return e;
    }
  }
}
