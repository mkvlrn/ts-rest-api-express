import { createMock } from '@golevelup/ts-jest';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

import { ErrorHandling } from '#/middlewares/ErrorHandling';
import { Router } from '#/server/Router';
import { Server } from '#/server/Server';

describe('Server.ts', () => {
  let listener: HttpServer<typeof IncomingMessage, typeof ServerResponse>;

  afterAll(() => {
    listener.close();
  });

  test('starts', () => {
    const sut = new Server(createMock<Router>(), createMock<ErrorHandling>());

    listener = sut.start(4002);

    expect(listener).toBeDefined();
  });
});
