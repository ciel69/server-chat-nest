import { Inject, BadRequestException } from '@nestjs/common';

import { defer, Observable } from 'rxjs';
import * as Joi from 'joi';

import { JOI_TOKEN, JOI_OPTIONS_TOKEN } from './constants';

export class JoiService {
  constructor(
    @Inject(JOI_TOKEN) private readonly joi: typeof Joi,
    @Inject(JOI_OPTIONS_TOKEN) private readonly options: Joi.ValidationOptions,
  ) {
  }

  public validate(value: any, schema: Joi.SchemaLike, options: Joi.ValidationOptions = {}): Observable<Joi.ValidationResult<any>> {
    return defer(async () => {
      try {
        return await this.joi.validate(value, schema, {
          ...this.options,
          ...options,
        });
      } catch (err) {
        throw new BadRequestException(err);
      }
    });
  }
}