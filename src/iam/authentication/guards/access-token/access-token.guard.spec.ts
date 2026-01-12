import { AccessTokenGuard } from './access-token.guard';
import {JwtService} from "@nestjs/jwt";

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'secret',
    issuer: 'issuer',
    audience: 'audience',
    accessTokenTtl: 3600,
    refreshTokenTtl: 604800,
    KEY: 'jwt',
  };

  beforeEach(() => {
    guard = new AccessTokenGuard(
        mockJwtService as unknown as JwtService,
        mockJwtConfig as any,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token', async () => {
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized');
  });

  it('should call jwtService.verifyAsync if token exists', async () => {
    const token = 'valid.token';
    const payload = { sub: 1 };
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } }),
      }),
    };

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
      secret: mockJwtConfig.secret,
      issuer: mockJwtConfig.issuer,
      audience: mockJwtConfig.audience,
    });
  });
});;
