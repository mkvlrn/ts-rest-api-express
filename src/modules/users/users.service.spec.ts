import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';

import { UsersService } from '#/modules/users/users.service';
import { AppError } from '#/server/AppError';

jest.mock('argon2', () => ({ hash: jest.fn(), verify: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

describe('users.service.ts', () => {
  describe('register', () => {
    test('success', async () => {
      const hashSpy = jest.spyOn(argon2, 'hash');

      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
              email: 'test@email.com',
            }),
          },
        }),
      );

      const result = await sut.register({
        email: 'test@email.com',
        password: '123456',
      });

      expect(hashSpy).toHaveBeenCalledWith('123456');
      expect(result).toEqual({
        email: 'test@email.com',
      });
    });

    test('fail - email in use', async () => {
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn().mockResolvedValue({
              email: 'test@email.com',
            }),
          },
        }),
      );

      const act = () =>
        sut.register({
          email: 'test@email.com',
          password: '123456',
        });

      await expect(act).rejects.toMatchObject<AppError>({
        name: 'AppError',
        statusCode: 409,
        type: 'CONFLICT',
        message: 'email already in use',
        details: null,
      });
    });

    test('fail - orm/database error', async () => {
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn(() => {
              throw new Error('database exploded');
            }),
          },
        }),
      );

      const act = () =>
        sut.register({
          email: 'test@email.com',
          password: '123456',
        });

      await expect(act).rejects.toMatchObject<AppError>({
        name: 'AppError',
        statusCode: 500,
        type: 'INTERNAL',
        message: 'database exploded',
        details: null,
      });
    });
  });

  describe('login', () => {
    test('success', async () => {
      const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      const signSpy = jest
        .spyOn(jsonwebtoken, 'sign')
        .mockImplementation(() => 'accessToken');
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ password: 'hashedPassword' }),
          },
        }),
      );

      const result = await sut.login({
        email: 'test@email.com',
        password: '123456',
      });

      expect(verifySpy).toHaveBeenCalledWith('hashedPassword', '123456');
      expect(signSpy).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'accessToken',
      });
    });

    test('fail - user not registered', async () => {
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      const act = () =>
        sut.login({
          email: 'test@email.com',
          password: '123456',
        });

      await expect(act).rejects.toMatchObject<AppError>({
        name: 'AppError',
        statusCode: 401,
        type: 'UNAUTHORIZED',
        message: 'invalid credentials',
        details: null,
      });
    });

    test('fail - wrong password', async () => {
      const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn().mockResolvedValue({ password: '123456' }),
          },
        }),
      );

      const act = () =>
        sut.login({
          email: 'test@email.com',
          password: 'wrong',
        });

      await expect(act).rejects.toMatchObject<AppError>({
        name: 'AppError',
        statusCode: 401,
        type: 'UNAUTHORIZED',
        message: 'invalid credentials',
        details: null,
      });
      expect(verifySpy).toHaveBeenCalledWith('123456', 'wrong');
    });

    test('fail - orm/database error', async () => {
      const sut = new UsersService(
        createMock<PrismaClient>({
          user: {
            findUnique: jest.fn(() => {
              throw new Error('database exploded');
            }),
          },
        }),
      );

      const act = () =>
        sut.login({
          email: 'test@email.com',
          password: '123456',
        });

      await expect(act).rejects.toMatchObject<AppError>({
        name: 'AppError',
        statusCode: 500,
        type: 'INTERNAL',
        message: 'database exploded',
        details: null,
      });
    });
  });
});
