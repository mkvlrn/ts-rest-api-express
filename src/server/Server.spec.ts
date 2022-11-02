import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

import { Server } from '#/server/Server';

describe('Server.ts', () => {
  let listener: HttpServer<typeof IncomingMessage, typeof ServerResponse>;

  afterAll(() => {
    listener.close();
  });

  test('starts', () => {
    const sut = new Server();

    listener = sut.start(9999);

    expect(listener).toBeDefined();
  });
});
