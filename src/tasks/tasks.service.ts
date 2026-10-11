import {
  Inject, Injectable, NotFoundException,
} from '@nestjs/common';
import type { Task, TaskStatus } from './task.model.js';
import { TasksRepository } from './tasks.repository.js';
import { APP_CONFIG } from '../config/app-config.js';
import type { AppConfig } from '../config/app-config.js';
import { UsersService } from '../users/users.service.js';
@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,          // class token, no @Inject
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly usersService: UsersService  // string token, needs @Inject
  ) {}

  findAll(status?: TaskStatus): Promise<Task[]> {
    return this.tasksRepository.findAll(status);   // filtering now happens in the database
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id);
    if (!task) throw new NotFoundException(`Task with id "${id}" not found`);
    return task;
  }

  async create(title: string, description: string, userId: string): Promise<Task> {
    await this.usersService.findOne(userId);   // throws 404 if user doesn't exist
    // ...your maxTasks check and logger line
    return this.tasksRepository.create({ title, description, userId });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    await this.findOne(id);   // throws 404 if it doesn't exist
    return this.tasksRepository.updateStatus(id, status);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);   // throws 404 if it doesn't exist
    await this.tasksRepository.delete(id);
  }
}
