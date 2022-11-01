import { PrismaClient, Task } from '@prisma/client';
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
}
