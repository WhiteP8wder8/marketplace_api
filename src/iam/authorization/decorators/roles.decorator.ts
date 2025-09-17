import {SetMetadata} from "@nestjs/common";
import {UsersRole} from "../../../users/enums/users-role.enum";

export const ROLES_KEY = 'roles';

export const Roles =(...roles: UsersRole[]) =>
  SetMetadata(ROLES_KEY, roles);
