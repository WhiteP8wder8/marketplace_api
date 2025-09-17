import {ConflictException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";
import {Repository} from "typeorm";
import {HashingService} from "../hashing/hashing.service";
import {SignUpDto} from "./dto/sign-up.dto/sign-up.dto";
import {SignInDto} from "./dto/sign-in.dto/sign-in.dto";
import {pgUniqueViolationErrorCode} from "../constants/errors.constant";
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {RefreshTokenDto} from "./dto/refresh-token.dto/refresh-token.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.name = signUpDto.name;
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.usersRepository.save(user);
    } catch (e) {
      if (e.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw e;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({email: signInDto.email});

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const isEqual: boolean = await this.hashingService.compare(signInDto.password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException('Email or password does not match');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const {sub} = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersRepository.findOneByOrFail({id: sub});

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async signToken(userId: number, expiresIn: number, payload) {
    return this.jwtService.signAsync({sub: userId, ...payload}, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      expiresIn,
      secret: this.jwtConfiguration.secret
    })
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {email: user.email, role: user.role}), this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {email: user.email})]);
    return {accessToken, refreshToken}
  }
}
