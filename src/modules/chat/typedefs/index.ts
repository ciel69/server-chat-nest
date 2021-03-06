import { User } from 'modules/user/typedefs';

export class CreateChatInput {
  text?: string;
}

export class Message {
  id?: number;
  text?: string;
  channelId?: number;
  uid?: number;
  channel?: Channel;
  user?: User;
}

export class Channel {
  id?: number;
  name?: string;
  messages?: Message[];
  users?: User[];
}

export abstract class IMutation {
  abstract createMessage(createChatInput?: CreateChatInput): Message | Promise<Message>;
}

export abstract class IQuery {
  abstract getMessage(): Message[] | Promise<Message[]>;

  abstract message(id: string): Message | Promise<Message>;
}

export abstract class ISubscription {
  abstract messageAdded(): Message | Promise<Message>;
}
