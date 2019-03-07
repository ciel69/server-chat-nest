import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel, Message } from './typedefs';

import { DialogEntity } from './entity/dialog.entity';

import data from './data/test';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/users.entity';

@Injectable()
export class ChatService {
  private readonly message: Message[] = [];
  private readonly channels: Channel[] = data;
  private newDialog: DialogEntity;
  private user: UserEntity;

  constructor(
    private readonly userService: UserService,

    @InjectRepository(DialogEntity)
    private readonly dialogRepository: Repository<DialogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  addChannel(name = 'faker') {
    let lastChannelId = this.channels.length || 0;
    lastChannelId++;
    const newChannel = {
      id: lastChannelId,
      name,
      messages: [],
    };
    this.channels.push(newChannel);
    return lastChannelId;
  }

  async create(message: Message): Promise<Message> {
    const channel = this.channels.find(item => +item.id === +message.channelId);
    if (!channel) throw new Error('Channel does not exist');

    const lastMessageId = +`${message.channelId}${(channel.messages && channel.messages.length || 0) + 1}`;

    const user = await this.userService.findOneById(message.uid);

    if (!user) throw new Error('User does not exist');

    const newMessage = {
      id: lastMessageId,
      text: message.text,
      createdAt: +new Date(),
      uid: message.uid,
    };

    channel.messages.push(newMessage);
    return { ...newMessage, user };
  }

  async findAll(): Promise<DialogEntity[]> {
    return await this.dialogRepository.find({ relations: ['users'] });
  }

  getChannel(id: number): Channel {
    const channel = this.channels.find(cat => +cat.id === +id);
    if (!channel) throw new Error('Channel does not exist');
    channel.messages = channel.messages.map((item: Message) => {
      const user = this.userService.findOneById(item.uid);
      return { ...item, user };
    });

    return channel;
  }

  async createChannel(uid: number): Promise<DialogEntity> {
    // const lastChannelId = this.channels.length;

    const users = await this.userRepository.find({
      where: [
        { id: 1 },
        { id: 2 },
      ],
    });

    const newDialog = new DialogEntity();
    newDialog.name = 'fake dialog';
    newDialog.users = [...users];

    return await this.dialogRepository.save(newDialog);

    // const newChannel = {
    //   id: lastChannelId,
    //   name: `channel ${uid}`,
    //   messages: [],
    // };
    //
    // this.channels.push(newChannel);
    //
    // return newChannel;
  }

  findOneById(id: number): Message {
    return this.message.find(cat => cat.id === id);
  }
}
