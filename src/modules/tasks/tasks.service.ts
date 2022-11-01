import { PrismaClient, Task, TaskStatus } from '@prisma/client';
import { injectable } from 'tsyringe';

import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';
import { AppError, AppErrorType } from '#/server/AppError';

@injectable()
export class TasksService {
  constructor(private orm: PrismaClient) {}

  async createTask(input: CreateTaskDto, userId: string): Promise<Task> {
    try {
      return await this.orm.task.create({
        data: { ...input, status: 'INCOMPLETE', userId },
      });
    } catch (err) {
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  }

  async updateTaskStatus(
    status: TaskStatus,
    taskId: string,
    userId: string,
  ): Promise<Task> {
    try {
      const exists = await this.orm.task.findUnique({ where: { id: taskId } });
      if (!exists) {
        throw new AppError(
          AppErrorType.NOT_FOUND,
          `task with id ${taskId} not found`,
        );
      }

      if (exists.userId !== userId) {
        throw new AppError(AppErrorType.FORBIDDEN, 'this task is not yours');
      }

      return await this.orm.task.update({
        where: { id: taskId },
        data: { status },
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<Task> {
    try {
      const exists = await this.orm.task.findUnique({ where: { id: taskId } });
      if (!exists) {
        throw new AppError(
          AppErrorType.NOT_FOUND,
          `task with id ${taskId} not found`,
        );
      }

      if (exists.userId !== userId) {
        throw new AppError(AppErrorType.FORBIDDEN, 'this task is not yours');
      }

      return await this.orm.task.delete({
        where: { id: taskId },
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(AppErrorType.INTERNAL, (err as Error).message);
    }
  }
}
