import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global()   // PrismaService can be injected anywhere without importing PrismaModule
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
