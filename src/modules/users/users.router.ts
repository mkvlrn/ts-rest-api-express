import { Router } from 'express';
import { injectable } from 'tsyringe';

import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { UsersController } from '#/modules/users/users.controller';
import { Middleware } from '#/server/Middleware';
import { Validator } from '#/server/Validator';

@injectable()
export class UsersRouter {
  public routes = Router();

  constructor(
    private middleware: Middleware,
    private controller: UsersController,
    private validator: Validator,
  ) {
    this.routes.use(
      '/register',
      this.validator.validate(UserInputDto),
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
