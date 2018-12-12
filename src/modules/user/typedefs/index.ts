export class CreateUserInput {
  text?: string;
}

export class User {
  id?: number;
  name?: string;
  login?: string;
}

export abstract class IMutation {
  abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;
}

export abstract class IQuery {
  abstract allUsers(): User[] | Promise<User[]>;

  abstract user(id: string): User | Promise<User>;
  abstract currentUser(): User | Promise<User>;
}

export abstract class ISubscription {
  abstract userCreated(): User | Promise<User>;
}

export interface UserPayload {
  login: string;
  password: string;
  token: string;
}
