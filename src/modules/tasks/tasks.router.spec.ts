import { createMock } from '@golevelup/ts-jest';

import { Authentication } from '#/middlewares/Authentication';
import { Validation } from '#/middlewares/Validation';
import { TasksController } from '#/modules/tasks/tasks.controller';
import { TasksRouter } from '#/modules/tasks/tasks.router';

describe('tasks.router.ts', () => {
  test('works', () => {
    const sut = new TasksRouter(
      createMock<TasksController>(),
      createMock<Authentication>(),
      createMock<Validation>({ validate: jest.fn(() => jest.fn()) }),
    );

    expect(sut).toBeDefined();
  });
});
