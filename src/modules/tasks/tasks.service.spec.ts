import { createMock } from '@golevelup/ts-jest';
import { PrismaClient, Task } from '@prisma/client';
import 'reflect-metadata';

import { GetManyTasksResponseDto } from '#/modules/tasks/dto/get-many-tasks-response.dto';
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

  describe('deleteTask', () => {
    test('success', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue({ userId: 'userId' }),
            delete: jest.fn().mockResolvedValue({}),
          },
        }),
      );

      const result = await sut.deleteTask('taskId', 'userId');

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

      const act = () => sut.deleteTask('taskId', 'userId');

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

      const act = () => sut.deleteTask('taskId', 'userId');

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

      const act = () => sut.deleteTask('taskId', 'userId');

      await expect(act).rejects.toThrow(AppError);
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 500,
          message: 'database exploded',
        }),
      );
    });
  });

  describe('getManyTasks', () => {
    test('success', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            count: jest.fn().mockResolvedValue(1),
            findMany: jest.fn().mockResolvedValue([{}]),
          },
        }),
      );

      const result = await sut.getManyTasks('userId');

      expect(result).toBeInstanceOf(GetManyTasksResponseDto);
      expect(result).toEqual<GetManyTasksResponseDto>({
        totalTasks: 1,
        totalPages: 1,
        page: 1,
        tasks: [{} as Task],
      });
    });

    test('fail - orm/db error', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            count: jest.fn().mockImplementation(() => {
              throw new AppError(AppErrorType.INTERNAL, 'database exploded');
            }),
          },
        }),
      );

      const act = () => sut.getManyTasks('userId', 2);

      await expect(act).rejects.toThrow(AppError);
      await expect(act).rejects.toMatchObject(
        expect.objectContaining({
          statusCode: 500,
          message: 'database exploded',
        }),
      );
    });
  });

  describe('getTask', () => {
    test('success', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue({ userId: 'userId' }),
          },
        }),
      );

      const result = await sut.getTask('taskId', 'userId');

      expect(result).toEqual({ userId: 'userId' });
    });

    test('fail - task not found', async () => {
      const sut = new TasksService(
        createMock<PrismaClient>({
          task: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        }),
      );

      const act = () => sut.getTask('taskId', 'userId');

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

      const act = () => sut.getTask('taskId', 'userId');

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

      const act = () => sut.getTask('taskId', 'userId');

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
