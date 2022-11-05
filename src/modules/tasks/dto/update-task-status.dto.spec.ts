import { UpdateTaskStatusDto } from '#/modules/tasks/dto/update-task-status.dto';

describe('update-task-status.dto', () => {
  test('works', () => {
    const sut = new UpdateTaskStatusDto();
    sut.status = 'COMPLETE';

    expect(sut).toBeDefined();
    expect(sut.status).toBe('COMPLETE');
  });
});
