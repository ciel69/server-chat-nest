import { UserEntity as User } from 'modules/user/entity/users.entity';

import { DialogModel as Dialog, genListDialogs } from 'modules/chat/models/dialog.model';
import { MessageModel as Message } from 'modules/chat/models/message.model';

export class UserModel implements User {
  public id: number;
  public name: string;
  public login: string;
  public salt: string;
  public password: string;
  public picture: string;
  public dialogs: Dialog[] | null;
  public messages: Message[] | null;

  constructor(params: any) {
    this.id = params.users_id;
    this.name = params.users_name;
    this.salt = params.users_salt || '';
    this.password = params.users_password || '';
    // this.dialogs = genListDialogs(params);
    this.dialogs = [];
    this.picture = params.users_picture || '';
    this.login = params.users_login || '';
  }
}
