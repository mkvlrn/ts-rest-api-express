import { Router } from 'express';
import { injectable } from 'tsyringe';

import { TasksController } from '#/modules/tasks/tasks.controller';

@injectable()
export class TasksRouter {
  public routes = Router();

  constructor(private controller: TasksController) {
    this.routes.post('/', this.controller.createTask);
  }
}
