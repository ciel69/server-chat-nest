import { Injectable } from '@nestjs/common';

import { Message } from './typedefs';

import data from './data/test';

@Injectable()
export class ChatService {
  private readonly message: Message[] = data;

  async create(message: Message): Promise<Message> {
    this.message.push({ ...message, id: this.message.length + 1 });
    return message;
  }

  findAll(): Message[] {
    return this.message;
  }

  findOneById(id: number): Message {
    return this.message.find(cat => cat.id === id);
  }
}