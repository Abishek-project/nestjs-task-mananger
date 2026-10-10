import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../logger.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // BEFORE the handler: we know exactly which controller + method will run
    const controller = context.getClass().name;    // "TasksController"
    const handler = context.getHandler().name;     // "findAll"
    const start = Date.now();

    // next.handle() runs the handler; tap() peeks at the result without changing it
    return next.handle().pipe(
      tap({
        next: () => this.logger.log('Interceptor', `${controller}.${handler} - ${Date.now() - start}ms`),
        error: (err: Error) =>
          this.logger.log('Interceptor', `${controller}.${handler} failed (${err.message}) - ${Date.now() - start}ms`),
      }),
    );
  }
}
