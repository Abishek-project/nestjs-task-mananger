import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import type { Task, TaskStatus } from './task.model.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
@Controller('tasks')   // All routes here start with /tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks  or  GET /tasks?status=OPEN
  @Get()
  findAll(@Query('status') status?: TaskStatus): Task[] {
    return this.tasksService.findAll(status);
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
  return this.tasksService.create(dto.title, dto.description, dto.userId);
}

  // PATCH /tasks/abc-123/status   body: { "status": "DONE" }

@Patch(':id/status')
updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto): Task {
  return this.tasksService.updateStatus(id, dto.status);
}

  // DELETE /tasks/abc-123
  @Delete(':id')
  @HttpCode(204)   // "No Content" instead of the default 200
  remove(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }
}