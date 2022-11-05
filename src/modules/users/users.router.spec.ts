import { createMock } from '@golevelup/ts-jest';

import { Authentication } from '#/middlewares/Authentication';
import { Validation } from '#/middlewares/Validation';
import { UsersController } from '#/modules/users/users.controller';
import { UsersRouter } from '#/modules/users/users.router';

describe('users.router.ts', () => {
  test('works', () => {
    const sut = new UsersRouter(
      createMock<UsersController>(),
      createMock<Validation>({ validate: jest.fn(() => jest.fn()) }),
      createMock<Authentication>(),
    );

    expect(sut).toBeDefined();
  });
});
