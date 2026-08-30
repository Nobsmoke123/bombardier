import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokenResponse, UserPublic } from '@job-tracker/types';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenResponse> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.users.create({
      name: dto.name.trim(),
      email: dto.email,
      password,
    });

    return this.issueAuth(user);
  }

  async login(dto: LoginDto): Promise<AuthTokenResponse> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueAuth(user);
  }

  toPublicUser(user: User): UserPublic {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      dailyTarget: user.dailyTarget,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private issueAuth(user: User): AuthTokenResponse {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: this.toPublicUser(user),
      accessToken,
    };
  }
}
