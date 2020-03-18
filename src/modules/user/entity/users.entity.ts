import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Type, Expose } from 'class-transformer';

import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';
import { MessageEntity as Message } from 'modules/chat/entity/message.entity';

@Entity('users')
export class UserEntity {

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 255, unique: true })
  login: string;

  @Expose()
  @Column({ length: 255, unique: true })
  email: string;

  @Expose()
  @Column({
    type: 'bytea',
  })
  public salt: string;

  @Expose()
  @Column({
    type: 'bytea',
    name: 'password',
  })
  public password: string;

  @Expose()
  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255, nullable: true  })
  lastName: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  picture: string;

  @Expose()
  @Type(() => Message)
  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @Expose()
  @Type(() => Dialog)
  @ManyToMany(type => Dialog, dialog => dialog.users)
  dialogs: Dialog[];
}
