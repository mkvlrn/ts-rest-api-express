import { UserInputDto } from '#/modules/users/dto/user-input.dto';

describe('user-input.dto.ts', () => {
  test('works', () => {
    const sut = new UserInputDto();

    expect(sut).toBeDefined();
  });
});
