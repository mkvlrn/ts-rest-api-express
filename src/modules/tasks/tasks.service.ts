import { PrismaClient, Task } from '@prisma/client';
import { injectable } from 'tsyringe';

import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';
import { GetManyTasksResponseDto } from '#/modules/tasks/dto/get-many-tasks-response.dto';
import { UpdateTaskStatusDto } from '#/modules/tasks/dto/update-task-status.dto';
import { AppError, AppErrorType } from '#/server/AppError';

@injectable()
export class TasksService {
  constructor(private orm: PrismaClient) {}

  createTask = async (input: CreateTaskDto, userId: string): Promise<Task> => {
    try {
      return await this.orm.task.create({
        data: { ...input, status: 'INCOMPLETE', userId },
      });
    } catch (err) {
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };

  updateTaskStatus = async (
    input: UpdateTaskStatusDto,
    taskId: string,
    userId: string,
  ): Promise<Task> => {
    try {
      const exists = await this.orm.task.findUnique({ where: { id: taskId } });
      if (!exists)
        throw new AppError(
          AppErrorType.NOT_FOUND,
          `task with id ${taskId} not found`,
        );

      if (exists.userId !== userId)
        throw new AppError(AppErrorType.FORBIDDEN, 'this task is not yours');

      return await this.orm.task.update({
        where: { id: taskId },
        data: { status: input.status },
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };

  deleteTask = async (taskId: string, userId: string): Promise<Task> => {
    try {
      const exists = await this.orm.task.findUnique({ where: { id: taskId } });
      if (!exists)
        throw new AppError(
          AppErrorType.NOT_FOUND,
          `task with id ${taskId} not found`,
        );

      if (exists.userId !== userId)
        throw new AppError(AppErrorType.FORBIDDEN, 'this task is not yours');

      return await this.orm.task.delete({
        where: { id: taskId },
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };

  getManyTasks = async (
    userId: string,
    page: number = 1,
  ): Promise<GetManyTasksResponseDto> => {
    try {
      const totalTasks = await this.orm.task.count({ where: { userId } });
      const tasks = await this.orm.task.findMany({
        where: { userId },
        take: 5,
        skip: (page - 1) * 5,
      });

      return new GetManyTasksResponseDto(
        totalTasks,
        Math.ceil(totalTasks / 5),
        5,
        page,
        tasks,
      );
    } catch (err) {
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };

  getTask = async (taskId: string, userId: string): Promise<Task> => {
    try {
      const task = await this.orm.task.findUnique({ where: { id: taskId } });
      if (!task)
        throw new AppError(
          AppErrorType.NOT_FOUND,
          `task with id ${taskId} not found`,
        );

      if (task.userId !== userId)
        throw new AppError(AppErrorType.FORBIDDEN, 'this task is not yours');

      return task;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  };
}
