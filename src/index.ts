import { config as dotenvConfig } from 'dotenv';

import { Server } from '#/server/Server';

dotenvConfig();

const server = new Server();

server.start(+process.env.PORT! || 4000);
