import { Router } from 'express';
import { injectable } from 'tsyringe';

import { AuthController } from '#/modules/auth/auth.controller';
import { Middleware } from '#/server/Middleware';

@injectable()
export class AuthRouter {
  public routes = Router();

  constructor(
    private middleware: Middleware,
    private controller: AuthController,
  ) {
    this.routes.use(
      '/register',
      this.middleware.asyncHandler(this.controller.register),
    );
    this.routes.use(
      '/login',
      this.middleware.asyncHandler(this.controller.login),
    );
    this.routes.use(
      '/whoami',
      this.middleware.authentication,
      this.middleware.asyncHandler(this.controller.whoami),
    );
  }
}
