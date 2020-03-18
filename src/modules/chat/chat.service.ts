import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { DialogEntity } from 'modules/chat/entity/dialog.entity';
import { Message } from 'modules/chat/typedefs';
import { MessageEntity } from 'modules/chat/entity/message.entity';

import { UserEntity } from 'modules/user/entity/users.entity';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(DialogEntity)
    private readonly dialogRepository: Repository<DialogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
  }

  async addChannel(name = 'faker') {
    const newDialog = new DialogEntity();
    newDialog.name = name;

    return await this.dialogRepository.save(newDialog);
  }

  async create(message: Message): Promise<MessageEntity> {
    const newMessage = {} as MessageEntity;
    newMessage.text = message.text;
    newMessage.user = { id: message.id } as UserEntity;
    newMessage.user = plainToClass(UserEntity, { id: message.id });
    newMessage.dialog = { id: message.channelId } as DialogEntity;
    return await this.messageRepository.save(plainToClass(MessageEntity, newMessage));
  }

  async findAll(): Promise<DialogEntity[]> {
    return await this.dialogRepository.find({
      where: [
        { 'users.id': 4 },
      ],
      relations: ['users', 'messages', 'messages.user'],
    });
  }

  async getChannel(id): Promise<DialogEntity> {
    return await this.dialogRepository.createQueryBuilder('dialogs')
      .leftJoinAndSelect('dialogs.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'user')
      .leftJoinAndSelect('dialogs.users', 'users')
      .where('dialogs.id = :id', { id: +id })
      .orderBy({
        'messages.created_at': 'ASC',
        'messages.id': 'ASC',
      })
      .getOne();
  }

  async createChannel(usersId): Promise<DialogEntity | any> {
    const dialogId: any = await getConnection().query(`SELECT "dialogsId", COUNT(*)
          FROM "dialogs_users_users"
          WHERE "dialogs_users_users"."usersId" IN (${usersId.join(',')})
          GROUP BY "dialogsId"
          HAVING COUNT(*) > 1
          LIMIT 1`);
    if (dialogId && dialogId.length > 0) {
      return {id: dialogId[0].dialogsId, name: '', users: [], messages: []};
    }

    const users = await this.userRepository.find({
      where: usersId.map(item => ({ id: item })),
    });

    const newDialog = new DialogEntity();
    newDialog.name = users.map((item => item.firstName)).join('‡');
    newDialog.users = [...users];
    return await this.dialogRepository.save(newDialog);
  }

  async findOneById(id: number): Promise<MessageEntity> {
    return await this.messageRepository.findOne(id);
  }
}
