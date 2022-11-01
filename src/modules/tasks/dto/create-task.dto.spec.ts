import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';

describe('create-task.dto.ts', () => {
  test('works', () => {
    const sut = new CreateTaskDto();

    sut.title = 'test';

    expect(sut).toBeDefined();
    expect(sut.title).toBe('test');
    expect(sut.description).toBeUndefined();
  });
});
