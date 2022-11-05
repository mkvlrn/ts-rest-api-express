import { RegisterResponseDto } from '#/modules/users/dto/register-response.dto';

describe('register-response.dto.ts', () => {
  test('works', () => {
    const sut = new RegisterResponseDto({
      id: 'userId',
      email: 'test@email.com',
      password: '123456',
    });

    expect(sut).toBeDefined();
    expect(sut).toEqual({
      id: 'userId',
      email: 'test@email.com',
    });
  });
});
