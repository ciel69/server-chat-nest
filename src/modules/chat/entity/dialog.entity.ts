import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Type, Expose } from 'class-transformer';

import { UserEntity as User } from 'modules/user/entity/users.entity';
import { MessageEntity as Message } from 'modules/chat/entity/message.entity';

@Entity('dialogs')
export class DialogEntity {

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 255 })
  name: string;

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
  @ManyToMany(type => User, user => user.dialogs)
  @JoinTable()
  users: User[];

  @Expose()
  @Type(() => Message)
  @OneToMany(type => Message, message => message.dialog)
  messages: Message[];
}
