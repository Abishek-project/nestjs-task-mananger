import { Injectable } from '@nestjs/common';
import { Task } from './task.model.js';
import { TasksRepository } from './tasks.repository.js';

@Injectable()
export class InMemoryTasksRepository implements TasksRepository {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  save(task: Task): Task {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) this.tasks[index] = task;
    else this.tasks.push(task);
    return task;
  }

  delete(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}