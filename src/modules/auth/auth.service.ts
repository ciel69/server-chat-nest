import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import * as Joi from 'joi';
import { JoiService } from 'providers';

import { JwtPayload, JwtToken } from 'modules/auth/interfaces/auth.interfaces';

import { UserService } from 'modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly joiService: JoiService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async createToken(args: JwtPayload): Promise<JwtToken> {
    await this.joiService
      .validate(args, Joi.object({
        login: Joi.string().max(128).required(),
      }))
      .toPromise();

    return {
      token: this.jwtService.sign(args),
    };
  }

  async validateUser(login: JwtPayload): Promise<any> {
    return await this.usersService.findOneByLogin(login);
  }
}
