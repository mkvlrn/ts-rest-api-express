import { Response } from 'express';
import { injectable } from 'tsyringe';

import { CustomRequest } from '#/interfaces/CustomRequest';
import { CreateTaskDto } from '#/modules/tasks/dto/create-task.dto';
import { UpdateTaskStatus } from '#/modules/tasks/dto/update-task-status.dto';
import { TasksService } from '#/modules/tasks/tasks.service';

@injectable()
export class TasksController {
  constructor(private service: TasksService) {}

  createTask = async (req: CustomRequest<CreateTaskDto>, res: Response) => {
    const { body, user } = req;
    const result = await this.service.createTask(body, user!.id);

    return res.status(201).json(result);
  };

  updateTaskStatus = async (
    req: CustomRequest<UpdateTaskStatus>,
    res: Response,
  ) => {
    const { body, user, params } = req;
    const result = await this.service.updateTaskStatus(
      body,
      params.taskId,
      user!.id,
    );

    return res.json(result);
  };

  deleteTask = async (req: CustomRequest, res: Response) => {
    const { user, params } = req;
    const result = await this.service.deleteTask(params.taskId, user!.id);

    return res.json(result);
  };

  getManyTasks = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const result = await this.service.getManyTasks(user!.id);

    return res.json(result);
  };

  getTask = async (req: CustomRequest, res: Response) => {
    const { user, params } = req;
    const result = await this.service.getTask(params.taskId, user!.id);

    return res.json(result);
  };
}
