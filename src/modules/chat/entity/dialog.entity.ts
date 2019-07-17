import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';

import { UserEntity as User } from 'modules/user/entity/users.entity';
import { MessageEntity as Message } from 'modules/chat/entity/message.entity';

@Entity('dialogs')
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

  @ManyToMany(type => User, user => user.dialogs)
  @JoinTable()
  users: User[];

  @OneToMany(type => Message, message => message.dialog)
  messages: Message[];
}
