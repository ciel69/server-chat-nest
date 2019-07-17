import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

import { UserEntity as User } from 'modules/user/entity/users.entity';
import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'integer' })
  userId: string;

  @Column({ type: 'integer' })
  dialogId: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @Column({
    type: 'timestamp with time zone',
    name: 'created_at',
    default: 'now()',
  })
  public createdAt: number | string;

  @ManyToOne(type => User, user => user.messages)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Dialog, dialog => dialog.messages)
  @JoinColumn()
  dialog: Dialog;
}
