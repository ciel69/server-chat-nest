import { DynamicModule, Global, Module } from '@nestjs/common';

import * as Joi from 'joi';
import { ValidationOptions } from 'joi';

import { JoiService } from './joi.service';
import { JOI_TOKEN, JOI_OPTIONS_TOKEN } from './constants';

@Global()
@Module({})
export class JoiModule {
  public static register(options: ValidationOptions = {}): DynamicModule {
    return {
      module: JoiModule,
      providers: [
        JoiService,
        {
          provide: JOI_TOKEN,
          useFactory: () => Joi,
        },
        {
          provide: JOI_OPTIONS_TOKEN,
          useValue: options,
        },
      ],
      exports: [JoiService],
    };
  }
}