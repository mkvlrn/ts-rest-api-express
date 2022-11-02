import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class Config {
  static PORT = +process.env.PORT!;

  static JWT_SECRET = process.env.JWT_SECRET!;

  static JWT_EXPIRATION = '30s';

  static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

  static JWT_REFRESH_EXPIRATION = '24h';
}
