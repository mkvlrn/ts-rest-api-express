import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { container, injectable } from 'tsyringe';

import { ErrorHandling } from '#/middlewares/ErrorHandling';
import { Envs } from '#/server/Envs';
import { Router } from '#/server/Router';

@injectable()
export class Server {
  private app = express();

  constructor(private router: Router, private errorHandler: ErrorHandling) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(this.router.routes);
    this.app.use(this.errorHandler.catchAll);
  }

  start = (port?: number) =>
    this.app.listen(port ?? Envs.PORT, () =>
      console.log(`server up @${port ?? Envs.PORT}`),
    );
}

container.register(PrismaClient, { useValue: new PrismaClient() });
export const createServer = () => container.resolve(Server);
