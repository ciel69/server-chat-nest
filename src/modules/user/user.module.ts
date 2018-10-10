import { Module } from '@nestjs/common';
import { UserResolvers } from './user.resolvers';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserResolvers],
  exports: [UserService],
})
export class UserModule {}