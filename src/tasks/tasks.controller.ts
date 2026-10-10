import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, HttpCode, UseGuards,
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
@UseGuards(AuthGuard, RolesGuard)   // runs in order: authenticate, then authorize
@Controller('tasks')   // All routes here start with /tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}



  // GET /tasks  or  GET /tasks?status=OPEN
@Get()
findAll(
  @Query('status', new TaskStatusPipe()) status?: TaskStatus,
  @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
): Task[] {
  return this.tasksService.findAll(status).slice(0, limit ?? 10);
}

  // GET /tasks/abc-123
  @Get(':id')
  findOne(@Param('id') id: string): Task | undefined {
    return this.tasksService.findOne(id);
  }

  // POST /tasks   body: { "title": "...", "description": "..." }
// @Post()
// create(@Body() body: { title: string; description: string; userId: string }): Task {
//   return this.tasksService.create(body.title, body.description, body.userId);
// }

@Post()
create(@Body() dto: CreateTaskDto): Task {
    console.log('Received:', dto);  
  return this.tasksService.create(dto.title, dto.description, dto.userId);
}

  // PATCH /tasks/abc-123/status   body: { "status": "DONE" }

@Patch(':id/status')
updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto): Task {
  return this.tasksService.updateStatus(id, dto.status);
}

  // DELETE /tasks/abc-123
  @Delete(':id')
  @Roles(Role.ADMIN)   // only admins can delete
  @HttpCode(204)   // "No Content" instead of the default 200
  remove(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }
}