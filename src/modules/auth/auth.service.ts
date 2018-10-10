import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import * as Joi from 'joi';
import { JoiService } from '../../providers';

import { JwtPayload, JwtToken } from './interfaces/auth.interfaces';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly joiService: JoiService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async createToken(args: JwtPayload): Promise<JwtToken> {
    console.log('args', args);
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
    // Validate if token passed along with HTTP request
    // is associated with any registered account in the database
    return await this.usersService.findOneByLogin(login);
  }
}