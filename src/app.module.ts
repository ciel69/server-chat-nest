import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ChatModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
