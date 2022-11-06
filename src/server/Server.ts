import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { injectable } from 'tsyringe';

import { ErrorHandling } from '#/middlewares/ErrorHandling';
import { Router } from '#/server/Router';

@injectable()
export class Server {
  private app = express();

  private httpServer: HttpServer;

  constructor(private router: Router, private errorHandler: ErrorHandling) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(this.router.routes);
    this.app.use(this.errorHandler.catchAll);

    this.httpServer = createServer(this.app);
    this.httpServer.on('listening', () => {
      // eslint-disable-next-line no-console
      console.log(
        `server up @${(this.httpServer.address() as AddressInfo).port}`,
      );
    });
  }

  start = (port: number) => this.httpServer.listen(port);
}
