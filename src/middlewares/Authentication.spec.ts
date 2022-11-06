import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import Redis from 'ioredis';
import * as jsonwebtoken from 'jsonwebtoken';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { Authentication } from '#/middlewares/Authentication';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn(), decode: jest.fn() }));

describe('Authentication.ts', () => {
  describe('jwtStrategy', () => {
    test('success', async () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementation(() => true);
      const sut = new Authentication(
        createMock<PrismaClient>({
          user: { findUnique: jest.fn().mockResolvedValue({}) },
        }),
        createMock<Redis>({
          exists: jest.fn().mockResolvedValue(0),
        }),
      );
      const nextSpy = jest.fn();

      await sut.jwtStrategy(
        createMock<CustomRequest>({ cookies: { accessToken: true } }),
        createMock<Response>(),
        nextSpy,
      );

      expect(nextSpy).toHaveBeenCalledWith();
    });

    test('fail - no jwt cookie', async () => {
      const sut = new Authentication(
        createMock<PrismaClient>(),
        createMock<Redis>(),
      );
      const nextSpy = jest.fn();

      await sut.jwtStrategy(
        createMock<CustomRequest>(),
        createMock<Response>(),
        nextSpy,
      );

      expect(nextSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          type: 'UNAUTHORIZED',
          message: 'missing jwt token',
          details: null,
        }),
      );
    });

    test('fail - logged out', async () => {
      const sut = new Authentication(
        createMock<PrismaClient>(),
        createMock<Redis>({
          exists: jest.fn().mockResolvedValue(1),
        }),
      );
      const nextSpy = jest.fn();

      await sut.jwtStrategy(
        createMock<CustomRequest>({ cookies: { accessToken: true } }),
        createMock<Response>(),
        nextSpy,
      );

      expect(nextSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          type: 'UNAUTHORIZED',
          message: 'token was invalidated',
          details: null,
        }),
      );
    });

    test('fail - token not verified', async () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementation(() => {
        throw new Error('terrible jwt token, just terrible!');
      });
      const sut = new Authentication(
        createMock<PrismaClient>(),
        createMock<Redis>({
          exists: jest.fn().mockResolvedValue(0),
        }),
      );
      const nextSpy = jest.fn();

      await sut.jwtStrategy(
        createMock<CustomRequest>({ cookies: { accessToken: true } }),
        createMock<Response>(),
        nextSpy,
      );

      expect(nextSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          type: 'UNAUTHORIZED',
          message: 'terrible jwt token, just terrible!',
          details: null,
        }),
      );
    });

    test('fail - user not in db', async () => {
      jest.spyOn(jsonwebtoken, 'verify').mockImplementation(() => true);
      const sut = new Authentication(
        createMock<PrismaClient>({
          user: { findUnique: jest.fn().mockResolvedValue(null) },
        }),
        createMock<Redis>({
          exists: jest.fn().mockResolvedValue(0),
        }),
      );
      const nextSpy = jest.fn();

      await sut.jwtStrategy(
        createMock<CustomRequest>({ cookies: { accessToken: true } }),
        createMock<Response>(),
        nextSpy,
      );

      expect(nextSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          type: 'UNAUTHORIZED',
          message: 'invalid credentials',
          details: null,
        }),
      );
    });
  });

  describe('invalidateJwt', () => {
    test('success', async () => {
      const decodeSpy = jest
        .spyOn(jsonwebtoken, 'decode')
        .mockImplementation(() => ({ exp: 1 }));
      const mockRedis = createMock<Redis>({
        set: jest.fn(),
      });
      const sut = new Authentication(createMock<PrismaClient>(), mockRedis);

      await sut.invalidateJwt('token');

      expect(decodeSpy).toHaveBeenCalledWith('token');
      expect(mockRedis.set).toHaveBeenCalledWith('token', 'invalid', 'EXAT', 1);
    });
  });
});
