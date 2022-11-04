import { config as dotenvConfig } from 'dotenv';

export abstract class Envs {
  constructor() {
    dotenvConfig();
  }

  static PORT = +process.env.PORT!;

  static JWT_SECRET = process.env.JWT_SECRET!;

  static JWT_EXPIRATION = process.env.JWT_EXPIRATION;

  static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

  static JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION!;
}
