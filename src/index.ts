import { Server } from '#/server/Server';

const server = new Server();

server.start(+process.env.PORT! || 4000);
