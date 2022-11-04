import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig();

export abstract class Envs {
  static PORT: string;

  static DATABASE_URL: string;

  static REDIS_URL: string;

  static JWT_SECRET: string;

  static JWT_EXPIRATION: string;

  static autoLoadEnv = (() => {
    Object.assign(this, env.parsed);
  })();
}
