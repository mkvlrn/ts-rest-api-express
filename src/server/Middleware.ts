import { NextFunction, Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AppError } from '#/server/AppError';

@injectable()
export class Middleware {
  errorHandler = (
    err: AppError,
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) =>
    next(
      res.status(err.statusCode).json({
        statusCode: err.statusCode,
        type: err.type,
        message: err.message,
        details: err.details,
      }),
    );
}
