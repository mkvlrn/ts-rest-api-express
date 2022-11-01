import { Task } from '@prisma/client';

export class GetManyTasksResponseDto {
  totalPages: number;

  constructor(
    public totalTasks: number,
    public page: number,
    public tasks: Task[],
  ) {
    this.totalPages = Math.ceil(this.totalTasks / 5);
  }
}
