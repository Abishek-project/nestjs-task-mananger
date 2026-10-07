import { Task } from './task.model.js';

export abstract class TasksRepository {
  abstract findAll(): Task[];
  abstract findById(id: string): Task | undefined;
  abstract save(task: Task): Task;
  abstract delete(id: string): void;
}