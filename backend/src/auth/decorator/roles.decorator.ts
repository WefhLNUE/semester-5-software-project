import { SetMetadata } from '@nestjs/common';
import { SystemRole } from 'src/employee-profile/enums/employee-profile.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
