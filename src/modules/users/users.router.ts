import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/middlewares/Authentication';
import { Validation } from '#/middlewares/Validation';
import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { UsersController } from '#/modules/users/users.controller';

@injectable()
export class UsersRouter {
  public routes = Router();

  constructor(
    private controller: UsersController,
    private validation: Validation,
    private authentication: Authentication,
  ) {
    this.routes.post(
      '/register',
      this.validation.validate(UserInputDto),
      this.controller.register,
    );

    this.routes.post(
      '/login',
      this.validation.validate(UserInputDto),
      this.controller.login,
    );

    this.routes.get(
      '/whoami',
      this.authentication.jwtStrategy,
      this.controller.whoami,
    );

    this.routes.get(
      '/logout',
      this.authentication.jwtStrategy,
      this.controller.logout,
    );
  }
}
