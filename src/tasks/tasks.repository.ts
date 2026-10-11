import type { Task, TaskStatus } from './task.model.js';

export interface CreateTaskData {
  title: string;
  description: string;
  userId: string;
}

// The contract every tasks storage must follow. TasksService only knows about this,
// so the storage (array, Postgres, ...) can be swapped in tasks.module.ts.
// Methods return Promises because real storage (a database) takes time to answer.
export abstract class TasksRepository {
  abstract findAll(status?: TaskStatus): Promise<Task[]>;
  abstract findById(id: string): Promise<Task | null>;
  abstract create(data: CreateTaskData): Promise<Task>;
  abstract updateStatus(id: string, status: TaskStatus): Promise<Task>;
  abstract delete(id: string): Promise<void>;
}
