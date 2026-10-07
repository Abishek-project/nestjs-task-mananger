import { Controller, Get, Param ,Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { User } from './user.model.js';
import { LoggerService } from '../common/logger.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService , private readonly loggerService: LoggerService) {}

  @Get()
  findAll(): User[] {
    this.loggerService.log('UsersController', 'Finding all users');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    this.loggerService.log('UsersController', `Finding user with ID: ${id}`);
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body('name') name: string): User {
    this.loggerService.log('UsersController', `Creating user with name: ${name}`);
    return this.usersService.create(name);
  }
}