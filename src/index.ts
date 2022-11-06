import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { Envs } from '#/server/Envs';
import { Server } from '#/server/Server';

container.register(PrismaClient, { useValue: new PrismaClient() });
container.register('RedisClient', {
  useValue: new Redis(Envs.REDIS_URL, {
    lazyConnect: true,
  }),
});
const server = container.resolve(Server);

server.start();
