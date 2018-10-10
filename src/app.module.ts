import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

import AppModules from 'modules';
import { JoiModule} from 'providers';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
    }),
    JoiModule.register({
      abortEarly: false,
      allowUnknown: true,
    }),
    ...AppModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
