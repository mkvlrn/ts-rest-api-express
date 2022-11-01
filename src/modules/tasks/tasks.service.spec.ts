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
          task: { create: jest.fn().mockResolvedValue({}) },
        }),
      );

      const result = await sut.createTask(
        { title: 'test_title', description: 'none' },
        'userId',
      );

      expect(result).toEqual({});
    });

    test('fail - orm/db error', async () => {
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
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 500,
          message: 'database exploded',
        }),
      );
    });
  });

  describe('updateTaskStatus', () => {
    test('success', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue({ userId: 'userId' }),
            update: jest.fn().mockResolvedValue({}),
          },
        }),
      );

      const result = await sut.updateTaskStatus(
        'IN_PROGRESS',
        'taskId',
        'userId',
      );

      expect(result).toEqual({});
    });

    test('fail - task not found', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      const act = () => sut.updateTaskStatus('IN_PROGRESS', 'taskId', 'userId');

      await expect(act).rejects.toThrow(AppError);
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 404,
          message: 'task with id taskId not found',
        }),
      );
    });

    test('fail - not owner of task', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue({ userId: 'wrong' }),
          },
        }),
      );

      const act = () => sut.updateTaskStatus('IN_PROGRESS', 'taskId', 'userId');

      await expect(act).rejects.toThrow(AppError);
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 403,
          message: 'this task is not yours',
        }),
      );
    });

    test('fail - orm/db error', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockImplementation(() => {
              throw new AppError(AppErrorType.INTERNAL, 'database exploded');
            }),
          },
        }),
      );

      const act = () => sut.updateTaskStatus('IN_PROGRESS', 'taskId', 'userId');

      await expect(act).rejects.toThrow(AppError);
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 500,
          message: 'database exploded',
        }),
      );
    });
  });
});
