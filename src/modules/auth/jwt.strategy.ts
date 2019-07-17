import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  public async validate(payload: JwtPayload, done: (err: Error, user: any) => void) {
    try {
      const user = await this.authService.validateUser({
        login: payload.login,
      });

      done(null, user);
    } catch (err) {
      done(new UnauthorizedException(), false);
    }
  }
}
