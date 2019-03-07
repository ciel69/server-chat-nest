import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entity/users.entity';
import { DialogEntity } from 'modules/chat/entity/dialog.entity';

import { UserResolvers } from './user.resolvers';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DialogEntity])],
  providers: [UserService, UserResolvers],
  exports: [UserService],
})
export class UserModule {}
