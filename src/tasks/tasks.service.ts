import {
  Inject, Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './task.model.js';
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

  findAll(status?: TaskStatus): Task[] {
    const tasks = this.tasksRepository.findAll();
    return status ? tasks.filter((t) => t.status === status) : tasks;
  }

  findOne(id: string): Task {
    const task = this.tasksRepository.findById(id);
    if (!task) throw new NotFoundException(`Task with id "${id}" not found`);
    return task;
  }

create(title: string, description: string, userId: string): Task {
  this.usersService.findOne(userId);   // throws 404 if user doesn't exist
  // ...your maxTasks check and logger line
  return this.tasksRepository.save({
    id: randomUUID(),
    title,
    description,
    status: TaskStatus.OPEN,
    userId,
  });
}

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.findOne(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }

  remove(id: string): void {
    this.findOne(id);   // throws 404 if it doesn't exist
    this.tasksRepository.delete(id);
  }
}