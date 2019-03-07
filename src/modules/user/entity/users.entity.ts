import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

import { DialogEntity as Dialog } from 'modules/chat/entity/dialog.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  login: string;

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
  name: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @ManyToMany(type => Dialog, dialog => dialog.users)
  dialogs: Dialog[];
}
