import { createMock } from '@golevelup/ts-jest';
import { IsDefined, IsString, Length } from 'class-validator';
import { Response } from 'express';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { Validation } from '#/middlewares/Validation';

class MockDto {
  @Length(2)
  @IsString()
  @IsDefined()
  test!: string;
}

describe('Validation.ts', () => {
  test('passes both body and query', async () => {
    const sut = new Validation();
    const nextSpy = jest.fn();

    const act = sut.validate(MockDto, MockDto);
    await act(
      createMock<CustomRequest>({
        body: { test: 'ok' },
        query: { test: 'also ok' },
      }),
      createMock<Response>(),
      nextSpy,
    );

    expect(nextSpy).toHaveBeenCalledWith();
  });

  test('errors both', async () => {
    const sut = new Validation();
    const nextSpy = jest.fn();

    const act = sut.validate(MockDto, MockDto);
    await act(
      createMock<CustomRequest>({
        body: { test: 0, invalid: true },
        query: { test: '' },
      }),
      createMock<Response>(),
      nextSpy,
    );

    expect(nextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        type: 'BAD_REQUEST',
        message: 'validation error',
        details: [
          'property invalid should not exist',
          'test must be a string',
          'test must be longer than or equal to 2 characters',
        ],
      }),
    );
  });
});
