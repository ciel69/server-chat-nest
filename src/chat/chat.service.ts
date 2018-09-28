import { Injectable } from '@nestjs/common';
import { Message } from '../graphql.schema';

@Injectable()
export class ChatService {
  private readonly message: Message[] = [{ id: 1, text: 'Test' }];

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