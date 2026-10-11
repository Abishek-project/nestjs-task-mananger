import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service.js';
import type { User } from '../../users/user.model.js';

export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Expect "Authorization: Bearer <userId>"
    // (in a real app the token would be a JWT you verify instead of a raw id)
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    try {
      request.user = await this.usersService.findOne(token);   // attach user for later guards / handlers
    } catch (e) {
      if (e instanceof NotFoundException) throw new UnauthorizedException('Invalid token');
      throw e;
    }

    return true;
  }
}
