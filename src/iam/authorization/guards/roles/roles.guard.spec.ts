import { RolesGuard } from './roles.guard';
import {Reflector} from "@nestjs/core";
import {REQUEST_USER_KEY} from "../../../constants/iam.constants";
import {ExecutionContext} from "@nestjs/common";
import {UsersRole} from "../../../../users/enums/users-role.enum";

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const createExecutionContext = (userRole?: UsersRole): ExecutionContext =>
      ({
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({
            [REQUEST_USER_KEY]: userRole
                ? { role: userRole }
                : undefined,
          }),
        }),
      } as unknown as ExecutionContext);

  beforeEach(() => {
    reflector = mockReflector as unknown as Reflector;
    guard = new RolesGuard(reflector);
    jest.clearAllMocks();
  });

  it('should allow access when no roles metadata is set', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
  });

  it('should allow access when user has required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([UsersRole.Admin]);

    const context = createExecutionContext(UsersRole.Admin);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user does not have required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([UsersRole.Admin]);

    const context = createExecutionContext(UsersRole.User);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});
