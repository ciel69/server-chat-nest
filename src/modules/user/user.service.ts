import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSalt, createHash } from 'utils';

import { UserPayload } from './typedefs';
import { UserEntity } from './entity/users.entity';
import { DialogEntity } from 'modules/chat/entity/dialog.entity';
import { MessageEntity } from 'modules/chat/entity/message.entity';

import { DialogModel } from 'modules/chat/models/dialog.model';
import { UserModel } from './models/user.model';

import * as Joi from 'joi';
import { JoiService } from 'providers';

import { JwtPayload } from '../auth/interfaces/auth.interfaces';
import { select } from 'async';

@Injectable()
export class UserService {
  constructor(
    private readonly joiService: JoiService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DialogEntity)
    private readonly dialogsRepository: Repository<DialogEntity>,
  ) {
  }

  public async createUser(args: UserPayload): Promise<UserEntity> {
    await this.joiService
      .validate(args, Joi.object({
        login: Joi.string().max(128),
        firstName: Joi.string().max(128).required(),
        lastName: Joi.string().max(128),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().max(128).required(),
      }))
      .toPromise();

    const user = new UserEntity();
    const salt = createSalt();

    user.login = args.email;
    user.email = args.email;
    user.firstName = args.firstName;
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

  async findOneById(id: any) {
    try {
      const result = await this.userRepository.createQueryBuilder('users')
      .addSelect('messages.id', 'messages_id')
      .addSelect('messages.text', 'messages_text')
      .addSelect('messages.picture', 'messages_picture')
      .addSelect('messages.created_at', 'messages_created_at')
      .addSelect('messages."userId"', 'messages_userId')
      .addSelect('messages."dialogId"', 'messages_dialogId')
      .addSelect('messages_user."id"', 'messages_user_id')
      .addSelect('messages_user."login"', 'messages_user_login')
      .addSelect('messages_user."email"', 'messages_user_email')
      .addSelect('messages_user."name"', 'messages_user_name')
      .leftJoinAndSelect('users.dialogs', 'dialogs')
      .leftJoinAndMapMany(
        'messages',
        query => {
          return query
            .select('*')
            .from(MessageEntity, 'messages')
            .where(qb => {
              const subQuery = qb.subQuery()
                .select('max(id)', 'id')
                .from(MessageEntity, 'mes')
                .groupBy('"dialogId"')
                .getQuery();
              return 'messages.id IN ' + subQuery;
            })
            .orderBy('messages.created_at', 'DESC');
        },
        'messages',
        'dialogs.id = messages."dialogId"',
      )
      .leftJoinAndMapMany(
        'users',
        query => query
          .select('*')
          .from(UserEntity, 'messages_user'),
        'messages_user',
        'messages."userId" = messages_user."id"',
      )
      .where('users.id = :id', { id: +id })
      .andWhere('messages.text IS NOT NULL')
      .getRawMany();

      const newResult = new UserModel(result[0]);

      result.forEach((item: any, index) => {
        newResult.dialogs[index] = new DialogModel(item);
      });
      return newResult;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
