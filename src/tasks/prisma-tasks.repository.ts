import { Injectable } from '@nestjs/common';
import type { Task, TaskStatus } from './task.model.js';
import { TasksRepository } from './tasks.repository.js';
import type { CreateTaskData } from './tasks.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: TaskStatus): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { status },              // status undefined → Prisma ignores the filter → all tasks
      orderBy: { createdAt: 'asc' },  // oldest first
    });
  }

  findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });   // null if not found
  }

  create(data: CreateTaskData): Promise<Task> {
    // id, status (OPEN), createdAt and updatedAt come from the schema defaults
    return this.prisma.task.create({ data });
  }

  updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data: { status } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
