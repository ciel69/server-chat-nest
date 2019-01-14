import { Injectable } from '@nestjs/common';

import { Channel, Message } from './typedefs';

import data from './data/test';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  private readonly message: Message[] = [];
  private readonly channels: Channel[] = data;

  constructor(
    private readonly userService: UserService,
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

    let lastMessageId = channel.messages && channel.messages.length || 0;

    const user = await this.userService.findOneById(message.uid);
    const newMessage = {
      id: lastMessageId++,
      text: message.text,
      createdAt: +new Date(),
      user,
    };
    this.message.push({ ...message, id: this.message.length + 1, user });

    channel.messages.push(newMessage);
    return newMessage;
  }

  findAll(): Message[] {
    return this.message.map((item: Message) => {
      const user = this.userService.findOneById(item.uid);
      return {...item, user};
    });
  }

  getChannel(id: number): Message {
    return this.channels.find(cat => +cat.id === +id);
  }

  findOneById(id: number): Message {
    return this.message.find(cat => cat.id === id);
  }
}
