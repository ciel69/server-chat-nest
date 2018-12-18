import { Injectable } from '@nestjs/common';

import { Message } from './typedefs';

import data from './data/test';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  private readonly message: Message[] = data;

  constructor(
    private readonly userService: UserService,
  ) {
  }

  async create(message: Message): Promise<Message> {
    const user = await this.userService.findOneById(message.uid);
    this.message.push({ ...message, id: this.message.length + 1, user });
    return { ...message, user};
  }

  findAll(): Message[] {
    return this.message.map((item: Message) => {
      const user = this.userService.findOneById(item.uid);
      return {...item, user};
    });
  }

  findOneById(id: number): Message {
    return this.message.find(cat => cat.id === id);
  }
}
