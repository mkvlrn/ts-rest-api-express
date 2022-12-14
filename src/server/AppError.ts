export enum AppErrorType {
  BAD_REQUEST = 400,
  CONFLICT = 409,
  FORBIDDEN = 403,
  INTERNAL = 500,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
}

export class AppError extends Error {
  statusCode: number;

  type: string;

  constructor(type: AppErrorType, message: string, public details: any = null) {
    super(message);

    this.name = 'AppError';
    this.type = AppErrorType[type];
    this.statusCode = type;
  }
}
