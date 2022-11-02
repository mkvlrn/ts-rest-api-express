import { Request } from 'express';

import { AuthPayload } from '#/interfaces/AuthPayload';

export interface CustomRequest<
  B = any,
  P extends string = any,
  Q extends string = any,
> extends Request {
  user?: AuthPayload;
  body: B;
  params: { [key in P]: string };
  query: { [key in Q]: string };
}
