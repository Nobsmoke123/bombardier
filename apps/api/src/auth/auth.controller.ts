import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type {
  AuthSuccessResponse,
  AuthTokenResponse,
  UserPublic,
} from '@job-tracker/types';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { AUTH_COOKIE_NAME, authCookieOptions } from '../common/auth-cookie.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenResponse> {
    const result = await this.auth.register(dto);
    this.setAccessCookie(response, result.accessToken);
    return result;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenResponse> {
    const result = await this.auth.login(dto);
    this.setAccessCookie(response, result.accessToken);
    return result;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_COOKIE_NAME, authCookieOptions());
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: UserPublic): AuthSuccessResponse {
    return { user };
  }

  private setAccessCookie(response: Response, token: string) {
    response.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
  }
}
