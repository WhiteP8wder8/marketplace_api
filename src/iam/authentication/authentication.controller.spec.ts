import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import {AuthenticationService} from "./authentication.service";

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: jest.Mocked<AuthenticationService>;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get(AuthenticationController);
    authService = module.get(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp should call authService.signUp and return result', async () => {
    const dto = {
      name: 'Alex',
      email: 'test@mail.com',
      password: '123123',
    };

    const serviceResult = {
      id: 1,
      name: 'Alex',
      email: 'test@mail.com',
    };

    authService.signUp.mockResolvedValue(serviceResult as any);

    const result = await controller.signUp(dto);

    expect(authService.signUp).toHaveBeenCalledWith(dto);
    expect(result).toEqual(serviceResult);
  });

  it('signIn should set cookies and return success message', async () => {
    const dto = {
      email: 'test@mail.com',
      password: '123123',
    };

    authService.signIn.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    } as any);

    const response = {
      cookie: jest.fn(),
    };

    const result = await controller.signIn(response as any, dto);

    expect(authService.signIn).toHaveBeenCalledWith(dto);
    expect(response.cookie).toHaveBeenCalledTimes(2);

    expect(result).toEqual({ message: 'Logged in successfully' });
  });

  it('refreshTokens should update cookies and return tokens', async () => {
    const dto = {
      refreshToken: 'old-refresh-token',
    };

    authService.refreshTokens.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    } as any);

    const response = {
      cookie: jest.fn(),
    };

    const result = await controller.refreshTokens(dto as any, response as any);

    expect(authService.refreshTokens).toHaveBeenCalledWith(dto);
    expect(response.cookie).toHaveBeenCalledTimes(2);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });
});
