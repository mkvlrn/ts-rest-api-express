import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class Config {
  static JWT_SECRET = process.env.JWT_SECRET!;
}
