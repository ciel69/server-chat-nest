import { UserEntity as User } from 'modules/user/entity/users.entity';

import { DialogModel as Dialog, genListDialogs } from 'modules/chat/models/dialog.model';
import { MessageModel as Message } from 'modules/chat/models/message.model';

export class UserModel implements User {
  public id: number;
  public firstName: string;
  public lastName: string;
  public login: string;
  public email: string;
  public salt: string;
  public password: string;
  public picture: string;
  public dialogs: Dialog[] | null;
  public messages: Message[] | null;

  constructor(params: any) {
    this.id = params.users_id;
    this.firstName = params.users_firstName;
    this.lastName = params.users_lastName;
    this.salt = params.users_salt || '';
    this.password = params.users_password || '';
    // this.dialogs = genListDialogs(params);
    this.dialogs = [];
    this.picture = params.users_picture || '';
    this.login = params.users_login || '';
    this.email = params.users_email || '';
  }
}


export const genListUser = (params): UserModel[] => {
  if (Array.isArray(params)) {
    return params.map(item => new UserModel(item));
  } else {
    return [new UserModel(params)];
  }
}
