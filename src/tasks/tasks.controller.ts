import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, HttpCode, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import type { Task, TaskStatus } from './task.model.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { TaskStatusPipe } from './pipes/task-status.pipe.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../users/user.model.js';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor.js';
@UseGuards(AuthGuard, RolesGuard)   // runs in order: authenticate, then authorize
@UseInterceptors(TimeoutInterceptor)   // only tasks routes get the 5s timeout
@Controller('tasks')   // All routes here start with /tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}



  // GET /tasks  or  GET /tasks?status=OPEN
@Get()
async findAll(
  @Query('status', new TaskStatusPipe()) status?: TaskStatus,
  @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
): Promise<Task[]> {
  const tasks = await this.tasksService.findAll(status);
  return tasks.slice(0, limit ?? 10);
}

  // GET /tasks/abc-123
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  // POST /tasks   body: { "title": "...", "description": "..." }
// @Post()
// create(@Body() body: { title: string; description: string; userId: string }): Task {
//   return this.tasksService.create(body.title, body.description, body.userId);
// }

@Post()
create(@Body() dto: CreateTaskDto): Promise<Task> {
    console.log('Received:', dto);  
  return this.tasksService.create(dto.title, dto.description, dto.userId);
}

  // PATCH /tasks/abc-123/status   body: { "status": "DONE" }

@Patch(':id/status')
updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto): Promise<Task> {
  return this.tasksService.updateStatus(id, dto.status);
}

  // DELETE /tasks/abc-123
  @Delete(':id')
  @Roles(Role.ADMIN)   // only admins can delete
  @HttpCode(204)   // "No Content" instead of the default 200
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}