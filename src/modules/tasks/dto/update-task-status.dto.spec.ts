import { UpdateTaskStatus } from '#/modules/tasks/dto/update-task-status.dto';

describe('update-task-status.dto', () => {
  test('works', () => {
    const sut = new UpdateTaskStatus();
    sut.status = 'COMPLETE';

    expect(sut).toBeDefined();
    expect(sut.status).toBe('COMPLETE');
  });
});
