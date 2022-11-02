import { createMock } from '@golevelup/ts-jest';
import { Task } from '@prisma/client';
import { Response } from 'express';
import 'reflect-metadata';

import { TasksController } from '#/modules/tasks/tasks.controller';
import { TasksService } from '#/modules/tasks/tasks.service';
import { CustomRequest } from '#/server/CustomRequest';

describe('tasks.controller.ts', () => {
  test('success', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        createTask: jest.fn().mockResolvedValue(
          createMock<Task>({
            id: 'taskId',
            title: 'test',
            description: null,
            status: 'INCOMPLETE',
            userId: 'userId',
          }),
        ),
      }),
    );
    const req = createMock<CustomRequest>({
      body: { title: 'test' },
      user: { id: 'userId' },
    });
    const res = createMock<Response>({});

    await sut.createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
