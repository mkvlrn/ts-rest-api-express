import { Task } from '@prisma/client';

export class GetManyTasksResponseDto {
  constructor(
    public totalTasks: number,
    public totalPages: number,
    public tasksPerPage: number,
    public page: number,
    public tasks: Task[],
  ) {}
}
