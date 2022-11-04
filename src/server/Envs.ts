import { config as dotenvConfig } from 'dotenv';

export abstract class Envs {
  constructor() {
    dotenvConfig();
  }

  static PORT = +process.env.PORT!;

  static REDIS_URL = process.env.REDIS_URL!;

  static JWT_SECRET = process.env.JWT_SECRET!;

  static JWT_EXPIRATION = +process.env.JWT_EXPIRATION!;
}
