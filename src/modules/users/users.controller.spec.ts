import { createMock } from '@golevelup/ts-jest';
import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Response } from 'express';
import supertest from 'supertest';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { Authentication } from '#/middlewares/Authentication';
import { UsersController } from '#/modules/users/users.controller';
import { UsersService } from '#/modules/users/users.service';

describe('users.controller.ts', () => {
  let app: Application;
  const userMiddleware = (
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    req.user = { id: 'userId', email: 'test@email.com' };
    next();
  };

  beforeEach(() => {
    app = express();
  });

  test('register', async () => {
    const sut = new UsersController(
      createMock<UsersService>({
        register: jest
          .fn()
          .mockResolvedValue({ id: 'userId', email: 'test@email.com' }),
      }),
      createMock<Authentication>(),
    );
    app.post('/', userMiddleware, sut.register);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 'userId', email: 'test@email.com' });
  });

  test('login', async () => {
    const sut = new UsersController(
      createMock<UsersService>({
        login: jest.fn().mockResolvedValue({ accessToken: 'accessToken' }),
      }),
      createMock<Authentication>(),
    );
    app.post('/', userMiddleware, sut.login);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toHaveLength(1);
    expect(response.headers['set-cookie'][0]).toMatch(
      /^accessToken=accessToken; Max-Age=3600; Path=\//,
    );
  });

  test('logout', async () => {
    const sut = new UsersController(
      createMock<UsersService>(),
      createMock<Authentication>({ invalidateJwt: jest.fn() }),
    );
    app.use(cookieParser());
    app.post('/', userMiddleware, sut.logout);

    const response = await supertest(app)
      .post('/')
      .set('Cookie', ['accessToken=accessToken; Max-Age=3600; Path=/'])
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers['set-cookie']).toEqual([
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
  });

  test('whoami', async () => {
    const sut = new UsersController(
      createMock<UsersService>(),
      createMock<Authentication>(),
    );
    app.post('/', userMiddleware, sut.whoami);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 'userId', email: 'test@email.com' });
  });
});
