import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {UsersRole} from "../../../../users/enums/users-role.enum";
import {ROLES_KEY} from "../../decorators/roles.decorator";
import {REQUEST_USER_KEY} from "../../../constants/iam.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const contextRoles = this.reflector.getAllAndOverride<UsersRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!contextRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest()[REQUEST_USER_KEY];
    return contextRoles.some((role) => user.role === role);
  }
}
