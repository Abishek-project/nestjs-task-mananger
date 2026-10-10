import { Injectable, NotFoundException , ConflictException } from '@nestjs/common';
import { Role } from './user.model.js';
import type { User } from './user.model.js';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: '1', name: 'Abishek', role: Role.ADMIN },
    { id: '2', name: 'Priya', role: Role.USER },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user;
  }
create(name: string): User {
  const exists = this.users.some(
    (u) => u.name.toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    throw new ConflictException(`User "${name}" already exists`);
  }
  const user: User = { id: String(this.users.length + 1), name, role: Role.USER };
  this.users.push(user);
  return user;
}
}