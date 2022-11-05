import { GetManyDto } from '#/modules/tasks/dto/get-many.dto';

describe('get-many.dto.ts', () => {
  test('works', () => {
    const sut = new GetManyDto();

    expect(sut).toBeDefined();
  });
});
