import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtToken } from './interfaces/auth.interfaces';

@Resolver('Auth')
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Query('login')
  public async login(@Args('login') login: string, @Args('password') password: string): Promise<JwtToken> {
    const token = await this.authService.createToken({
      login,
    });
    console.log('token', token);
    return token;
  }
}