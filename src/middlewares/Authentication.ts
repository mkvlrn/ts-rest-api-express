import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { createClient } from 'redis';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AppError, AppErrorType } from '#/server/AppError';
import { Envs } from '#/server/Envs';

@injectable()
export class Authentication {
  constructor(private orm: PrismaClient) {}

  jwtStrategy = async (
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    const { accessToken } = req.cookies;
    try {
      if (!accessToken)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'missing jwt token');

      const loggedout = await this.checkBlacklist(accessToken);
      if (loggedout)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'token was invalidated');

      const payload = verify(accessToken, Envs.JWT_SECRET) as {
        sub: string;
      };

      const user = await this.orm.user.findUnique({
        where: { id: payload.sub },
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

  invalidateJwt = async (token: string) => {
    const redis = createClient({ url: Envs.REDIS_URL });
    redis.on('error', (err) => {
      throw new AppError(
        AppErrorType.INTERNAL,
        'jwt invalidation',
        (err as Error).message,
      );
    });

    const decoded = decode(token) as Partial<{ exp: number }>;

    await redis.connect();
    await redis.set(token, 'invalid', { EXAT: decoded!.exp });
    await redis.disconnect();
  };

  private checkBlacklist = async (token: string): Promise<Boolean> => {
    const redis = createClient({ url: Envs.REDIS_URL });
    redis.on('error', (err) => {
      throw new AppError(
        AppErrorType.INTERNAL,
        'jwt invalidation',
        (err as Error).message,
      );
    });

    await redis.connect();
    const blacklisted = await redis.exists(token);
    await redis.disconnect();

    return Boolean(blacklisted);
  };
}
