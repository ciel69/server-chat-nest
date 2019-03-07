import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

import { UserEntity as User } from 'modules/user/entity/users.entity';
import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

@Entity('messages')
export class DialogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @Column({
    type: 'timestamp with time zone',
    name: 'created_at',
    default: 'now()',
  })
  public createdAt: number | string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToOne(type => Dialog)
  @JoinColumn()
  dialog: Dialog;
}
