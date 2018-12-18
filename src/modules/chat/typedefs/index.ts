import { User } from 'modules/user/typedefs/index';

export class CreateChatInput {
  text?: string;
}

export class Message {
  id?: number;
  text?: string;
  uid?: number;
  user?: User;
}

export abstract class IMutation {
  abstract createMessage(createChatInput?: CreateChatInput): Message | Promise<Message>;
}

export abstract class IQuery {
  abstract getMessage(): Message[] | Promise<Message[]>;

  abstract message(id: string): Message | Promise<Message>;
}

export abstract class ISubscription {
  abstract chatCreated(): Message | Promise<Message>;
}
