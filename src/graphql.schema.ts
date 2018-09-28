export class CreateCatInput {
    name?: string;
    age?: number;
}

export class CreateChatInput {
    text?: string;
}

export class Cat {
    id?: number;
    name?: string;
    age?: number;
}

export class Message {
    id?: number;
    text?: string;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract createMessage(createChatInput?: CreateChatInput): Message | Promise<Message>;
}

export abstract class IQuery {
    abstract getCats(): Cat[] | Promise<Cat[]>;

    abstract cat(id: string): Cat | Promise<Cat>;

    abstract getMessage(): Message[] | Promise<Message[]>;

    abstract message(id: string): Message | Promise<Message>;

    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract catCreated(): Cat | Promise<Cat>;

    abstract chatCreated(): Message | Promise<Message>;
}
