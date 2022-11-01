import { createMock } from '@golevelup/ts-jest';
import { Task } from '@prisma/client';

import { GetManyTasksResponseDto } from '#/modules/tasks/dto/get-many-tasks-response.dto';

describe('get-many-tasks-response.dto.ts', () => {
  test('works', () => {
    const sut = new GetManyTasksResponseDto(
      10,
      1,
      createMock<Task[]>([{}, {}, {}, {}, {}]),
    );

    expect(sut).toBeDefined();
    expect(sut.totalTasks).toBe(10);
    expect(sut.totalPages).toBe(2);
    expect(sut.page).toBe(1);
    expect(sut.tasks).toHaveLength(5);
  });
});
