import { PrismaClient, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { AuthTokens } from '#/interfaces/AuthTokens';
import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { AppError, AppErrorType } from '#/server/AppError';
import { Envs } from '#/server/Envs';

@injectable()
export class UsersService {
  constructor(private orm: PrismaClient) {}

  register = async (input: UserInputDto): Promise<User> => {
    try {
      const { email, password } = input;
      const user = await this.orm.user.findUnique({ where: { email } });
      if (user)
        throw new AppError(AppErrorType.CONFLICT, 'email already in use');

      const passwordHash = await hash(password);
      return await this.orm.user.create({
        data: { email, password: passwordHash },
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };

  login = async (input: UserInputDto): Promise<AuthTokens> => {
    try {
      const { email, password } = input;
      const user = await this.orm.user.findUnique({ where: { email } });
      if (!user)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      const passwordMatches = await verify(user.password, password);
      if (!passwordMatches)
        throw new AppError(AppErrorType.UNAUTHORIZED, 'invalid credentials');

      const accessToken = sign({ email: user.email }, Envs.JWT_SECRET, {
        expiresIn: Envs.JWT_EXPIRATION,
      });

      const refreshToken = sign(
        { email: user.email },
        Envs.JWT_REFRESH_SECRET,
        {
          expiresIn: Envs.JWT_REFRESH_EXPIRATION,
        },
      );

      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
