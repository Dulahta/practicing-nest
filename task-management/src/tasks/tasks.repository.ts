import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.model';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
// complex database interactions/operations and data manipulation logic related to tasks
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.repository.createQueryBuilder('task');
    query.where({user});

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user : User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.repository.save(task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOne(id: string, user: User): Promise<Task | null> {
    return this.repository.findOne({ where: { id, user } });
  }

  async delete(id: string, user: User) {
    return this.repository.delete({ id, user });
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }
}
