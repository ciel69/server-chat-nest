import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

import AppModules from 'modules';
import { JoiModule} from 'providers';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-46-137-170-51.eu-west-1.compute.amazonaws.com',
      port: 5432,
      username: 'ojqkhmezuwdlsd',
      password: '0aece556cc77fc9bfd76a55f77c158ed99dcc4272ee50f09c53369d9ce060624',
      database: 'df2koloojuhbev',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
    }),
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
