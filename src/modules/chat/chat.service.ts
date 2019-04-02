import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './typedefs';

import { DialogEntity } from './entity/dialog.entity';
import { MessageEntity } from './entity/message.entity';
import { UserEntity } from '../user/entity/users.entity';

import { UserService } from '../user/user.service';

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
    newMessage.user = await this.userRepository.findOne(message.uid);
    newMessage.dialog = await this.dialogRepository.findOne(message.channelId);
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
    return await this.dialogRepository.findOne({
      where: [
        { id: +id },
      ],
      relations: ['messages', 'messages.user', 'users'] });
  }

  async createChannel(uid: number): Promise<DialogEntity> {
    const users = await this.userRepository.find({
      where: [
        { id: 4},
      ],
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
