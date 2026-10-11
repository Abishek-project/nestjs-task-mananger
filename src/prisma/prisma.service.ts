import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma 7 talks to Postgres through the "pg" driver adapter
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter });
  }

  // Runs when the app starts: open the connection
  async onModuleInit() {
    await this.$connect();
  }

  // Runs when the app shuts down: close the connection cleanly
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
