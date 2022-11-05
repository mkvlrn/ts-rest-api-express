import { TaskStatus } from '@prisma/client';
import { IsDefined, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: `status should be one of ${Object.keys(TaskStatus)
      .map((key) => key)
      .join('|')}`,
  })
  @IsDefined()
  status!: TaskStatus;
}
