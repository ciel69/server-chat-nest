import { MessageEntity as Message } from 'modules/chat/entity/message.entity';

import { DialogModel as Dialog } from 'modules/chat/models/dialog.model';
import { UserModel as User } from 'modules/user/models/user.model';

export class MessageModel implements Message {
  public id: number;
  public text: string;
  public createdAt: number | string;
  public dialog: Dialog | null;
  public dialogs: Dialog[] | null;
  public picture: string;
  public userId: string;
  public dialogId: string;
  public user: User;

  constructor(params: any) {
    this.id = params.messages_id;
    this.userId = params.messages_userId;
    this.dialogId = params.messages_dialogId;
    this.createdAt = params.messages_created_at;
    this.picture = params.messages_picture || '';
    this.text = params.messages_text;
    this.userId = params.messages_userId;
    this.user = params.user || {};
  }
}

export const genListMessage = (params): MessageModel[] => {
  if (Array.isArray(params)) {
    return params.map(item => new MessageModel(item));
  } else {
    return [new MessageModel(params)];
  }
}
