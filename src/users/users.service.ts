import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from './user.model.js';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: '1', name: 'Abishek' },
    { id: '2', name: 'Priya' },
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
  const user: User = { id: String(this.users.length + 1), name };
  this.users.push(user);
  return user;
}
}