import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import { JoiService } from 'providers';
import { createSalt, createHash } from 'utils';

import { UserPayload } from 'modules/user/typedefs';
import { UserEntity as User } from 'modules/user/entity/users.entity';

import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';
import { MessageEntity as Message} from 'modules/chat/entity/message.entity';

import { DialogModel } from 'modules/chat/models/dialog.model';
import { UserModel } from 'modules/user/models/user.model';

import { JwtPayload } from 'modules/auth/interfaces/auth.interfaces';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    private readonly joiService: JoiService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
  ) {
  }

  public async createUser(args: UserPayload): Promise<User> {
    await this.joiService
      .validate(args, Joi.object({
        login: [Joi.string().max(128), Joi.empty()],
        firstName: Joi.string().max(128).required(),
        lastName: [Joi.string().max(128), Joi.empty()],
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().max(128).required(),
      }))
      .toPromise();

    const user = new User();
    const salt = createSalt();

    user.login = args.login || args.email;
    user.email = args.email;
    user.firstName = args.firstName;
    user.lastName = args.lastName || '';
    user.password = createHash(args.password, salt);
    user.salt = salt;

    return await this.userRepository.save(user);
  }

  public async findOneByLogin(payload: JwtPayload): Promise<User> {
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

  public async findOneByLoginAndPassword(args: UserPayload): Promise<User> {
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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: any) {
    try {
      const result: User[] = await this.userRepository.createQueryBuilder('users')
      .addSelect('messages.id', 'messages_id')
      .addSelect('messages.text', 'messages_text')
      .addSelect('messages.picture', 'messages_picture')
      .addSelect('messages.created_at', 'messages_created_at')
      .addSelect('messages."userId"', 'messages_userId')
      .addSelect('messages."dialogId"', 'messages_dialogId')
      .addSelect('messages_user."id"', 'messages_user_id')
      .addSelect('messages_user."login"', 'messages_user_login')
      .addSelect('messages_user."firstName"', 'messages_user_firstName')
      .addSelect('messages_user."email"', 'messages_user_email')
      .addSelect('messages_user."lastName"', 'messages_user_lastName')
      .leftJoinAndSelect('users.dialogs', 'dialogs')
      .leftJoinAndMapMany(
        'messages',
        query => {
          return query
            .select('*')
            .from(Message, 'messages')
            .where(qb => {
              const subQuery = qb.subQuery()
                .select('max(id)', 'id')
                .from(Message, 'mes')
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
          .from(User, 'messages_user'),
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
