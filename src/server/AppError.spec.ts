import { AppError, AppErrorType } from '#/server/AppError';

describe('AppError.ts', () => {
  test('works', () => {
    const sut = new AppError(AppErrorType.BAD_REQUEST, 'wrong stuff');

    expect(sut.statusCode).toBe(400);
    expect(sut.name).toBe('AppError');
    expect(sut.type).toBe('BAD_REQUEST');
    expect(sut.message).toBe('wrong stuff');
    expect(sut.details).toBeNull();
  });
});
