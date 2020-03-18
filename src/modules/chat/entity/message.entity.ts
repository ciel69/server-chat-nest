import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Type, Expose } from 'class-transformer';

import { UserEntity as User } from 'modules/user/entity/users.entity';
import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

@Entity('messages')
export class MessageEntity {

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'text' })
  text: string;

  @Expose()
  @Column({ type: 'integer' })
  userId: string;

  @Expose()
  @Column({ type: 'integer' })
  dialogId: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  picture: string;

  @Expose()
  @Column({
    type: 'timestamp with time zone',
    name: 'created_at',
    default: 'now()',
  })
  public createdAt: number | string;

  @Expose()
  @Type(() => User)
  @ManyToOne(type => User, user => user.messages)
  @JoinColumn()
  user: User;

  @Expose()
  @Type(() => Dialog)
  @ManyToOne(type => Dialog, dialog => dialog.messages)
  @JoinColumn()
  dialog: Dialog;
}
