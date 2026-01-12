import {Test, TestingModule} from '@nestjs/testing';
import {AuthenticationService} from './authentication.service';
import {ConflictException, UnauthorizedException} from "@nestjs/common";
import jwtConfig from "../config/jwt.config";
import {JwtService} from "@nestjs/jwt";
import {HashingService} from "../hashing/hashing.service";
import {ConfigType} from "@nestjs/config";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const mockUsersRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    secret: 'secret',
    issuer: 'issuer',
    audience: 'audience',
    accessTokenTtl: 3600,
    refreshTokenTtl: 604800,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: HashingService, useValue: mockHashingService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: jwtConfig.KEY, useValue: mockJwtConfig },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash password and save user', async () => {
      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockUsersRepository.save.mockResolvedValue({ id: 1 });

      const dto = { name: 'John', email: 'john@test.com', password: '123456' };
      await service.signUp(dto);

      expect(mockHashingService.hash).toHaveBeenCalledWith('123456');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John',
            email: 'john@test.com',
            password: 'hashedPassword',
          }),
      );
    });

    it('should throw ConflictException on duplicate email', async () => {
      const dto = { name: 'John', email: 'john@test.com', password: '123456' };
      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockUsersRepository.save.mockRejectedValue({ code: '23505' }); // pgUniqueViolationErrorCode

      await expect(service.signUp(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      const dto = { email: 'test@test.com', password: '123456' };
      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hash' });
      mockHashingService.compare.mockResolvedValue(false);

      const dto = { email: 'test@test.com', password: 'wrong' };
      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should generate tokens if valid', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hash', role: 'User' };
      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');

      const dto = { email: 'test@test.com', password: '123456' };
      const tokens = await service.signIn(dto);

      expect(tokens).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
      await expect(service.refreshTokens({ refreshToken: 'bad' })).rejects.toThrow(UnauthorizedException);
    });

    it('should generate new tokens if valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });
      mockUsersRepository.findOneByOrFail.mockResolvedValue({ id: 1, email: 'a', role: 'User' });
      mockJwtService.signAsync.mockResolvedValueOnce('access').mockResolvedValueOnce('refresh');

      const tokens = await service.refreshTokens({ refreshToken: 'valid' });

      expect(tokens).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    });
  });
});
