import { Injectable, NotFoundException , ConflictException } from '@nestjs/common';
import type { User } from './user.model.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user;
  }

  async create(name: string): Promise<User> {
    // case-insensitive: "abishek" counts as a duplicate of "Abishek"
    const exists = await this.prisma.user.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (exists) {
      throw new ConflictException(`User "${name}" already exists`);
    }
    // id, role and createdAt are filled in by the @default(...) values in the schema
    return this.prisma.user.create({ data: { name } });
  }
}
