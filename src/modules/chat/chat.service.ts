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

  findAll(): Channel[] {
    return this.channels;
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

  createChannel(uid: number): Channel {
    const lastChannelId = this.channels.length;

    const newChannel = {
      id: lastChannelId,
      name: `channel ${uid}`,
      messages: [],
    };

    this.channels.push(newChannel);

    return newChannel;
  }

  findOneById(id: number): Message {
    return this.message.find(cat => cat.id === id);
  }
}
