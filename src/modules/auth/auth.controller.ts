import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { AuthService } from '#/modules/auth/auth.service';
import { RegisterResponseDto } from '#/modules/auth/dto/register-response.dto';
import { UserInputDto } from '#/modules/auth/dto/user-input.dto';

@injectable()
export class AuthController {
  constructor(private service: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.whoami = this.whoami.bind(this);
  }

  async register(req: CustomRequest<UserInputDto>, res: Response) {
    const result = await this.service.register(req.body);

    return res.status(201).json(new RegisterResponseDto(result));
  }

  async login(req: CustomRequest<UserInputDto>, res: Response) {
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
  }

  async whoami(req: CustomRequest<UserInputDto>, res: Response) {
    return res.json(req.user);
  }
}
