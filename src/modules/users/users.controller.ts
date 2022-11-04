import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { RegisterResponseDto } from '#/modules/users/dto/register-response.dto';
import { UserInputDto } from '#/modules/users/dto/user-input.dto';
import { UsersService } from '#/modules/users/users.service';

@injectable()
export class UsersController {
  constructor(private service: UsersService) {}

  register = async (req: CustomRequest<UserInputDto>, res: Response) => {
    const result = await this.service.register(req.body);

    return res.status(201).json(new RegisterResponseDto(result));
  };

  login = async (req: CustomRequest<UserInputDto>, res: Response) => {
    const { accessToken, refreshToken } = await this.service.login(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ ok: true });
  };

  logout = async (req: CustomRequest<UserInputDto>, res: Response) => {
    res.cookie('accessToken', undefined, { maxAge: 0 });
    res.cookie('refreshToken', undefined, { maxAge: 0 });
  };

  whoami = async (req: CustomRequest<UserInputDto>, res: Response) =>
    res.json(req.user);
}
