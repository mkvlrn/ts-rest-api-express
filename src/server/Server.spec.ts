import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

import { createServer } from '#/server/Server';

describe('Server.ts', () => {
  let listener: HttpServer<typeof IncomingMessage, typeof ServerResponse>;

  afterAll(() => {
    listener.close();
  });

  test('starts', () => {
    const sut = createServer();

    listener = sut.start(4002);

    expect(listener).toBeDefined();
  });
});
