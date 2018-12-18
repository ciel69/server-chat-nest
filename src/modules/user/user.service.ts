import { Injectable, BadRequestException } from '@nestjs/common';

import { User } from './typedefs';

import * as Joi from 'joi';
import { JoiService } from 'providers';

import data from './data/test';
import { JwtPayload } from '../auth/interfaces/auth.interfaces';

@Injectable()
export class UserService {
  constructor(
    private readonly joiService: JoiService,
  ) {
  }
  private readonly users: User[] = data;

  async create(user: User): Promise<User> {
    this.users.push({ ...user, id: this.users.length + 1 });
    return user;
  }

  public async findOneByLogin(payload: JwtPayload): Promise<User> {
    await this.joiService
      .validate(payload, Joi.object({
        login: Joi.string().max(128).required(),
      }))
      .toPromise();

    const user: User = await this.users.filter(item => item.login === payload.login).pop();

    console.log('user', user);
    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOneById(id: any): User {
    return this.users.filter(cat => cat.id === parseInt(id, 10)).pop();
  }
}
