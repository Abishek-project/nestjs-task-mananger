import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor() {
    console.log('LoggerService created');
  }

  log(context: string, message: string) {
    console.log(`[${context}] ${message}`);
  }
}