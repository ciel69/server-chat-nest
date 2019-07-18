import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DialogEntity } from 'modules/chat/entity/dialog.entity';
import { MessageEntity } from 'modules/chat/entity/message.entity';

import { UserEntity } from 'modules/user/entity/users.entity';
import { UserResolvers } from 'modules/user/user.resolvers';
import { UserService } from 'modules/user/user.service';

import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DialogEntity, MessageEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    UserResolvers,
  ],
  exports: [UserService],
})
export class UserModule {
}
