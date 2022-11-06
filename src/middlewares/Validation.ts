import { plainToInstance } from 'class-transformer';
import {
  validate as classValidate,
  ValidationError,
  ValidatorOptions,
} from 'class-validator';
import { NextFunction, Response } from 'express';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AppError, AppErrorType } from '#/server/AppError';

export class Validation {
  validate =
    (bodyDto?: any, queryDto?: any) =>
    async (req: CustomRequest, _res: Response, next: NextFunction) => {
      const errors: ValidationError[] = [];
      const opt: ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
      };

      if (bodyDto) {
        const { body } = req;
        const bodyObj = plainToInstance(bodyDto, body);
        const bodyErrors = await classValidate(bodyObj, opt);
        errors.push(...bodyErrors);
      }

      if (queryDto) {
        const { query } = req;
        const queryObj = plainToInstance(queryDto, query) as object;
        const queryErrors = await classValidate(queryObj, opt);
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
