import { Router } from 'express';
import { injectable } from 'tsyringe';

import { Authentication } from '#/auth/Authentication';
import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { UsersController } from '#/modules/users/users.controller';
import { Validator } from '#/server/Validator';

@injectable()
export class UsersRouter {
  public routes = Router();

  constructor(
    private controller: UsersController,
    private validator: Validator,
    private auth: Authentication,
  ) {
    this.routes.post(
      '/register',
      this.validator.validate(UserInputDto),
      this.controller.register,
    );

    this.routes.post(
      '/login',
      this.validator.validate(UserInputDto),
      this.controller.login,
    );

    this.routes.get('/whoami', this.auth.jwtStrategy, this.controller.whoami);

    this.routes.get('/logout', this.auth.jwtStrategy, this.controller.logout);
  }
}
