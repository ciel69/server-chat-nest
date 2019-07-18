import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from 'modules/auth/auth.service';
import { JwtToken } from 'modules/auth/interfaces/auth.interfaces';

import { UserService } from 'modules/user/user.service';

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
