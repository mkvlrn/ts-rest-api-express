import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

import { TasksService } from '#/modules/tasks/tasks.service';
import { AppError, AppErrorType } from '#/server/AppError';

describe('tasks.service.ts', () => {
  describe('createTask', () => {
    test('success', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: { create: jest.fn().mockReturnValue({}) },
        }),
      );

      const result = await sut.createTask(
        { title: 'test_title', description: 'none' },
        'userId',
      );

      expect(result).toEqual({});
    });
  });

  test('orm/db failure', async () => {
    const sut = new TasksService(
      createMock<PrismaClient>({
        task: {
          create: jest.fn().mockImplementation(() => {
            throw new AppError(AppErrorType.INTERNAL, 'database exploded');
          }),
        },
      }),
    );

    const act = () => sut.createTask({ title: '' }, 'userId');

    await expect(act).rejects.toThrow(AppError);
    await expect(act).rejects.toThrow('database exploded');
  });
});
