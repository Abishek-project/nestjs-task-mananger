import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/user.model.js';

export const ROLES_KEY = 'roles';

// Attaches metadata to a route, e.g. @Roles(Role.ADMIN) → { roles: ['ADMIN'] }
// RolesGuard reads it back with the Reflector.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
