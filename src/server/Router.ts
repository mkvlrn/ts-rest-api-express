import { Request, Response, Router as XRouter } from 'express';
import { injectable } from 'tsyringe';

import { UsersRouter } from '#/modules/users/users.router';

@injectable()
export class Router {
  public routes = XRouter();

  constructor(private authRouter: UsersRouter) {
    this.routes.use('/users', this.authRouter.routes);
    this.routes.get('/', (_req: Request, res: Response) =>
      res.json({ ok: true }),
    );
  }
}
