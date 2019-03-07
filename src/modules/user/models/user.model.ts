import { UserEntity as User } from 'modules/user/entity/users.entity';
import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

export class UserModel implements User {
  public id: number;
  public name: string;
  public login: string;
  public salt: string;
  public password: string;
  public picture: string;
  public dialogs: Dialog[];

  constructor(params: any) {
    this.name = params.name;
    this.salt = params.salt;
    this.password = params.password;
    this.picture = params.picture;
    this.login = params.login;
  }
}
