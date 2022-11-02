import { createMock } from '@golevelup/ts-jest';
import express, { Application, NextFunction, Response } from 'express';
import 'reflect-metadata';
import supertest from 'supertest';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { TasksController } from '#/modules/tasks/tasks.controller';
import { TasksService } from '#/modules/tasks/tasks.service';

describe('tasks.controller.ts', () => {
  let app: Application;
  const userMiddleware = (
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    req.user = { id: 'userId', email: 'user@email.com' };
    next();
  };

  beforeEach(() => {
    app = express();
  });

  test('createTask', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        createTask: jest.fn().mockResolvedValue({ title: 'test' }),
      }),
    );
    app.post('/', userMiddleware, sut.createTask);

    const response = await supertest(app).post('/').send();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      title: 'test',
    });
  });

  test('updateTaskStatus', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        updateTaskStatus: jest.fn().mockResolvedValue({ title: 'test' }),
      }),
    );
    app.patch('/:id', userMiddleware, sut.updateTaskStatus);

    const response = await supertest(app).patch('/taskId').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: 'test',
    });
  });

  test('deleteTask', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        deleteTask: jest.fn().mockResolvedValue({ title: 'test' }),
      }),
    );
    app.delete('/:taskId', userMiddleware, sut.deleteTask);

    const response = await supertest(app).delete('/taskId');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: 'test',
    });
  });

  test('getManyTasks', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        getManyTasks: jest.fn().mockResolvedValue([]),
      }),
    );
    app.get('/', userMiddleware, sut.getManyTasks);

    const response = await supertest(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('getTask', async () => {
    const sut = new TasksController(
      createMock<TasksService>({
        getTask: jest.fn().mockResolvedValue({ title: 'test' }),
      }),
    );
    app.get('/:taskId', userMiddleware, sut.getTask);

    const response = await supertest(app).get('/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: 'test',
    });
  });
});
