import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

import AppModules from 'modules';
import { JoiModule} from 'providers';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';

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
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     ExpressSessionMiddleware.configure({
//       secret: 'keyboard cat',
//       resave: false,
//       saveUninitialized: true,
//       cookie: { secure: true },
//     });
//     consumer
//       .apply(ExpressSessionMiddleware)
//       .forRoutes('*');
//   }
// }
