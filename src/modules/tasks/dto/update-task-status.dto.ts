import { TaskStatus } from '@prisma/client';

export class UpdateTaskStatus {
  status!: TaskStatus;
}
