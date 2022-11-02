import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';
import { UpdateTaskStatus } from '#/modules/tasks/dto/update-task-status.dto';
import { TasksService } from '#/modules/tasks/tasks.service';

@injectable()
export class TasksController {
  constructor(private service: TasksService) {
    this.createTask.bind(this);
  }

  async createTask(req: CustomRequest<CreateTaskDto>, res: Response) {
    const { body, user } = req;
    const result = await this.service.createTask(body, user!.id);

    return res.status(201).json(result);
  }

  async updateTaskStatus(req: CustomRequest<UpdateTaskStatus>, res: Response) {
    const { body, user, params } = req;
    const result = await this.service.updateTaskStatus(
      body,
      params.taskId,
      user!.id,
    );

    return res.status(201).json(result);
  }
}
