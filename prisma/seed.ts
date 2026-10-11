// Fills the database with starting data. Run with: npx prisma db seed
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const users = [
  { id: '1', name: 'Abishek', role: Role.ADMIN },
  { id: '2', name: 'Priya', role: Role.USER },
];

async function main() {
  for (const user of users) {
    // upsert = update if the id exists, create if not → safe to run the seed many times
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
  console.log(`Seeded ${users.length} users`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
