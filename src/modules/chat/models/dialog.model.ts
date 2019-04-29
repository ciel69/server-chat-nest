import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

import { MessageModel as Message, genListMessage } from 'modules/chat/models/message.model';
import { UserModel as User } from 'modules/user/models/user.model';

export class DialogModel implements Dialog {
  public id: number;
  public name: string;
  public picture: string;
  public messages: Message[];
  public createdAt: number | string;
  public users: User[];

  constructor(params: any) {
    this.id = params.dialogs_id;
    this.name = params.dialogs_name || '';
    this.picture = params.dialogs_picture || '';
    this.messages = params.messages_id ? genListMessage(params) : [];
    this.createdAt = params.dialogs_created_at || '';
  }
}

export const genListDialogs = (params): DialogModel[] => params.map(item => new DialogModel(item));
