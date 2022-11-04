import { Request } from 'express';

export interface CustomRequest<
  B extends object = any,
  P extends string = any,
  Q extends string = any,
> extends Request {
  user?: { id: string; email: string };
  body: B;
  params: { [key in P]: string };
  query: { [key in Q]: string };
}
