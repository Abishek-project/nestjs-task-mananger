import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TasksRepository } from './tasks.repository.js';
import { InMemoryTasksRepository } from './in-memory-tasks.repository.js';
import { UsersModule } from '../users/users.module.js'; 
import { CommonModule } from '../common/common.module.js';
@Module({
  controllers: [TasksController],
  providers: [TasksService, { provide: TasksRepository, useClass: InMemoryTasksRepository }, { provide: 'APP_CONFIG', useValue: { maxTasks: 10 } }, ],
  imports: [UsersModule],
})
export class TasksModule {}
