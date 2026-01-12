import {Body, Controller, HttpCode, HttpStatus, Post, Res} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {SignUpDto} from "./dto/sign-up.dto/sign-up.dto";
import {SignInDto} from "./dto/sign-in.dto/sign-in.dto";
import {Response} from "express";
import {Auth} from "./decorators/auth.decorator";
import {AuthType} from "./enums/auth-type.enum";
import {RefreshTokenDto} from "./dto/refresh-token.dto/refresh-token.dto";

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
  ) {
  }

  @Post('sign-Up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-In')
  async signIn(@Res({passthrough: true}) response: Response, @Body() signInDto: SignInDto) {
    const {accessToken, refreshToken} = await this.authService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      sameSite: true,
      httpOnly: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      sameSite: true,
      httpOnly: true,
    });
    return {message: 'Logged in successfully'}
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto, @Res({ passthrough: true }) response: Response) {
    const {accessToken, refreshToken} = await this.authService.refreshTokens(refreshTokenDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      sameSite: true,
      httpOnly: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      sameSite: true,
      httpOnly: true,
    });

    return {accessToken, refreshToken}
  }
}
