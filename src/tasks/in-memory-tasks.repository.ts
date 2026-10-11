import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TaskStatus } from './task.model.js';
import type { Task } from './task.model.js';
import { TasksRepository } from './tasks.repository.js';
import type { CreateTaskData } from './tasks.repository.js';

// Array-based storage: data is lost on restart. Not used anymore (see tasks.module.ts),
// but kept to show that two implementations can follow the same TasksRepository contract.
@Injectable()
export class InMemoryTasksRepository implements TasksRepository {
  private tasks: Task[] = [];

  async findAll(status?: TaskStatus): Promise<Task[]> {
    return status ? this.tasks.filter((t) => t.status === status) : this.tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const now = new Date();
    const task: Task = { id: randomUUID(), ...data, status: TaskStatus.OPEN, createdAt: now, updatedAt: now };
    this.tasks.push(task);
    return task;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task "${id}" not found`);
    task.status = status;
    task.updatedAt = new Date();
    return task;
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
