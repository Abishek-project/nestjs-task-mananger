import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { CommonModule } from '../common/common.module.js';

@Module({

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService so that it can be injected into other modules
})
export class UsersModule {}
