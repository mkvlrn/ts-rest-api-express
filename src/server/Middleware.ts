import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AppError, AppErrorType } from '#/server/AppError';
import { Envs } from '#/server/Envs';

@injectable()
export class Middleware {
  constructor(private orm: PrismaClient) {}

  authentication = async (
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    const { accessToken } = req.cookies;
    try {
      if (!accessToken)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'missing jwt token');

      const payload = verify(accessToken, Envs.JWT_SECRET) as {
        email: string;
      };
      const user = await this.orm.user.findUnique({
        where: { email: payload.email },
      });
      if (!user)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      req.user = { id: user.id, email: user.email };

      return next();
    } catch (err) {
      if (err instanceof AppError) return next(err);

      let errType = AppErrorType.INTERNAL;
      if ((err as Error).message.includes('jwt'))
        errType = AppErrorType.UNAUTHORIZED;
      return next(new AppError(errType, (err as Error).message));
    }
  };

  asyncHandler =
    (fn: Function) => (req: CustomRequest, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res, next)).catch(next);

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
