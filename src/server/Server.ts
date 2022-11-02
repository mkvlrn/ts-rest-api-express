import express, { Request, Response } from 'express';

export class Server {
  private app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get('/', (_req: Request, res: Response) =>
      res.json({ message: 'yo' }),
    );
  }

  start = (port: number) =>
    this.app.listen(port, () => console.log(`server up @${port}`));
}
