import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSalt, createHash } from 'utils';

import { User, UserPayload } from './typedefs';
import { UserEntity } from './entity/users.entity';
import { UserModel } from './models/user.model';

import * as Joi from 'joi';
import { JoiService } from 'providers';

import data from './data/test';
import { JwtPayload } from '../auth/interfaces/auth.interfaces';

@Injectable()
export class UserService {
  constructor(
    private readonly joiService: JoiService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  private readonly users: User[] = data;

  async create(user: User): Promise<User> {
    this.users.push({ ...user, id: this.users.length + 1 });
    return user;
  }

  public async createUser(args: UserPayload): Promise<UserEntity>{
    await this.joiService
      .validate(args, Joi.object({
        login: Joi.string().max(128).required(),
        password: Joi.string().max(128).required(),
      }))
      .toPromise();

    const user = new UserEntity();
    const salt = createSalt();

    user.login = args.login;
    user.name = args.login;
    user.password = createHash(args.password, salt);
    user.salt = salt;

    return await this.userRepository.save(user);
  }

  public async findOneByLogin(payload: JwtPayload): Promise<UserEntity> {
    await this.joiService
      .validate(payload, Joi.object({
        login: Joi.string().max(128).required(),
      }))
      .toPromise();

    const user = await this.userRepository.findOne({
      login: payload.login,
    });

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  public async findOneByLoginAndPassword(args: UserPayload): Promise<UserEntity> {
    await this.joiService
      .validate(args, Joi.object({
        login: Joi.string().max(128).required(),
        password: Joi.string().max(128).required(),
      }))
      .toPromise();

    const entity = await this.findOneByLogin(args);
    const user = await this.userRepository.findOne({
      login: args.login,
      password: createHash(args.password, entity.salt),
    });

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  findOneById(id: any): User {
    return this.users.find(item => +item.id === +id);
  }
}
