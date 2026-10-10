import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(5000),   // error if the handler takes longer than 5s
      catchError((err) =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException())   // → 408
          : throwError(() => err),                             // other errors pass through untouched
      ),
    );
  }
}
