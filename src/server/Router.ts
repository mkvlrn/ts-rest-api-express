import { Router as XRouter } from 'express';
import { injectable } from 'tsyringe';

import { TasksRouter } from '#/modules/tasks/tasks.router';
import { UsersRouter } from '#/modules/users/users.router';

@injectable()
export class Router {
  public routes = XRouter();

  constructor(
    private usersRouter: UsersRouter,
    private tasksRouter: TasksRouter,
  ) {
    this.routes.use('/users', this.usersRouter.routes);
    this.routes.use('/tasks', this.tasksRouter.routes);
  }
}
