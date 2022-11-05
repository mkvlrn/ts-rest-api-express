import { createMock } from '@golevelup/ts-jest';

import { TasksRouter } from '#/modules/tasks/tasks.router';
import { UsersRouter } from '#/modules/users/users.router';
import { Router } from '#/server/Router';

describe('Router.ts', () => {
  test('works', () => {
    const sut = new Router(
      createMock<UsersRouter>(),
      createMock<TasksRouter>(),
    );

    expect(sut).toBeDefined();
  });
});
