import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { Authentication } from '#/middlewares/Authentication';
import { RegisterResponseDto } from '#/modules/users/dto/register-response.dto';
import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { UsersService } from '#/modules/users/users.service';
import { Envs } from '#/server/Envs';

@injectable()
export class UsersController {
  constructor(
    private service: UsersService,
    private authentication: Authentication,
  ) {}

  register = async (req: CustomRequest<UserInputDto>, res: Response) => {
    const result = await this.service.register(req.body);

    return res.status(201).json(new RegisterResponseDto(result));
  };

  login = async (req: CustomRequest<UserInputDto>, res: Response) => {
    const { accessToken } = await this.service.login(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: +Envs.JWT_EXPIRATION * 1000,
    });

    return res.json({ success: true });
  };

  logout = async (req: CustomRequest<UserInputDto>, res: Response) => {
    const token = req.cookies.accessToken;
    res.cookie('accessToken', undefined, { maxAge: 0 });
    await this.authentication.invalidateJwt(token);

    return res.json({ success: true });
  };

  whoami = async (req: CustomRequest<UserInputDto>, res: Response) =>
    res.json(req.user);
}
