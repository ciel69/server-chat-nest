import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from 'modules/auth/auth.service';
import { AuthResolvers } from 'modules/auth/auth.resolvers';
import { JwtStrategy } from 'modules/auth/jwt.strategy';

import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    AuthResolvers,
    JwtStrategy,
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
