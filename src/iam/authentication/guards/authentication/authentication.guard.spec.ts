import { AuthenticationGuard } from './authentication.guard';
import {AccessTokenGuard} from "../access-token/access-token.guard";
import {Reflector} from "@nestjs/core";

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  const mockReflector = { getAllAndOverride: jest.fn() } as unknown as Reflector;
  const mockAccessTokenGuard = { canActivate: jest.fn() } as unknown as AccessTokenGuard;

  beforeEach(() => {
    guard = new AuthenticationGuard(mockReflector, mockAccessTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
