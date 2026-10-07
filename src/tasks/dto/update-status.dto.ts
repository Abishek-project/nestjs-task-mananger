import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model.js';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}