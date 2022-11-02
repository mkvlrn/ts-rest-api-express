export enum AppErrorType {
  INTERNAL = 500,
  CONFLICT = 409,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
}

export class AppError extends Error {
  statusCode: number;

  type: string;

  constructor(type: AppErrorType, message: string) {
    super(message);

    this.name = 'AppError';
    this.type = AppErrorType[type];
    this.statusCode = type;
  }
}
