import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Response } from 'express';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AppError, AppErrorType } from '#/server/AppError';

export class Validation {
  validate = (bodyClass?: any, queryClass?: any) =>
    this.doValidate<typeof bodyClass, typeof queryClass>(bodyClass, queryClass);

  private doValidate =
    <B extends object = any, Q extends string = any>(
      bodyClass?: ClassConstructor<B>,
      queryClass?: ClassConstructor<Q>,
    ) =>
    async (
      req: CustomRequest<B, any, Q>,
      _res: Response,
      next: NextFunction,
    ) => {
      const errors: ValidationError[] = [];
      if (bodyClass) {
        const { body } = req;
        const bodyObj = plainToInstance(bodyClass, body);
        const bodyErrors = await validate(bodyObj, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
        errors.push(...bodyErrors);
      }
      if (queryClass) {
        const { query } = req;
        const queryObj = plainToInstance(
          queryClass,
          query,
        ) as unknown as object;
        const queryErrors = await validate(queryObj, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
        errors.push(...queryErrors);
      }
      if (errors.length) {
        const details = errors.map(
          (error) => error.constraints![Object.keys(error.constraints!)[0]],
        );
        return next(
          new AppError(AppErrorType.BAD_REQUEST, 'validation error', details),
        );
      }

      return next();
    };
}
