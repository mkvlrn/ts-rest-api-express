import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/middlewares/Authentication';
import { Validation } from '#/middlewares/Validation';
import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';
import { GetManyDto } from '#/modules/tasks/dto/get-many.dto';
import { UpdateTaskStatusDto } from '#/modules/tasks/dto/update-task-status.dto';
import { TasksController } from '#/modules/tasks/tasks.controller';

@injectable()
export class TasksRouter {
  public routes = Router();

  constructor(
    private controller: TasksController,
    private authentication: Authentication,
    private validation: Validation,
  ) {
    this.routes.use(this.authentication.jwtStrategy);

    this.routes.post(
      '/',
      this.validation.validate(CreateTaskDto),
      this.controller.createTask,
    );
    this.routes.patch(
      '/:taskId',
      this.validation.validate(UpdateTaskStatusDto),
      this.controller.updateTaskStatus,
    );
    this.routes.delete('/:taskId', this.controller.deleteTask);
    this.routes.get(
      '/',
      this.validation.validate(undefined, GetManyDto),
      this.controller.getManyTasks,
    );
    this.routes.get('/taskId', this.controller.getTask);
  }
}
