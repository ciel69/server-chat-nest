import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DialogEntity } from 'modules/chat/entity/dialog.entity';
import { DialogModel } from 'modules/chat/models/dialog.model';
import { Message } from 'modules/chat/typedefs';
import { MessageEntity } from 'modules/chat/entity/message.entity';

import { UserEntity } from 'modules/user/entity/users.entity';
import { UserService } from 'modules/user/user.service';
import { UserModel } from 'modules/user/models/user.model';

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
    const newMessage = new MessageEntity();
    newMessage.text = message.text;
    // newMessage.user = await this.userRepository.findOne(message.uid);
    newMessage.user = new UserModel({users_id: message.id});
    // newMessage.dialog = await this.dialogRepository.findOne(message.channelId);
    newMessage.dialog = new DialogModel({dialogs_id: message.channelId});
    return await this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<DialogEntity[]> {
    return await this.dialogRepository.find({
      where: [
        { 'users.id': 4 },
      ],
      relations: ['users', 'messages', 'messages.user'] });
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

  async createChannel(usersId): Promise<DialogEntity> {
    const users = await this.userRepository.find({
      where: usersId.map(item => ({id: item})),
    });

    const newDialog = new DialogEntity();
    newDialog.name = 'fake dialog';
    newDialog.users = [...users];

    return await this.dialogRepository.save(newDialog);
  }

  async findOneById(id: number): Promise<MessageEntity> {
    return await this.messageRepository.findOne(id);
  }
}
