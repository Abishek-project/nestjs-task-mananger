import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model.js';

@Injectable()
export class TaskStatusPipe implements PipeTransform {
  transform(value: any) {
    console.log('TaskStatusPipe received:', value);

    // 1. Optional: no status sent → allow it
    if (value === undefined) {
      return undefined;
    }

    // 2. Transform: make it uppercase
    const upper = String(value).toUpperCase();

    // 3. Validate: is it a real status?
    const allowed = Object.values(TaskStatus);   // ['OPEN', 'IN_PROGRESS', 'DONE']
    if (!allowed.includes(upper as TaskStatus)) {
      throw new BadRequestException(
        `"${value}" is not a valid status. Use: ${allowed.join(', ')}`,
      );
    }

    // 4. Return the new value → this is what the controller receives
    return upper;
  }
}