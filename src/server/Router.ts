import { Request, Response, Router as XRouter } from 'express';
import { injectable } from 'tsyringe';

import { AuthRouter } from '#/modules/auth/auth.router';

@injectable()
export class Router {
  public routes = XRouter();

  constructor(private authRouter: AuthRouter) {
    this.routes.use('/auth', this.authRouter.routes);
    this.routes.get('/', (req: Request, res: Response) =>
      res.json({ ok: true }),
    );
  }
}
