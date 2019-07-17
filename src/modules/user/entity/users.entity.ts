import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';
import { MessageEntity as Message } from 'modules/chat/entity/message.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  login: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({
    type: 'bytea',
  })
  public salt: string;

  @Column({
    type: 'bytea',
    name: 'password',
  })
  public password: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255, nullable: true  })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @ManyToMany(type => Dialog, dialog => dialog.users)
  dialogs: Dialog[];
}
