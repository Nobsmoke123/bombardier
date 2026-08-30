import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };
  const jwt = {
    sign: vi.fn(),
  };

  const user = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Ada',
    email: 'ada@example.com',
    password: 'hashed',
    dailyTarget: 20,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    jwt.sign.mockReturnValue('signed-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('registers a new user and returns a token', async () => {
    users.findByEmail.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed');
    users.create.mockResolvedValue(user);

    const result = await service.register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'password1',
    });

    expect(users.create).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'hashed',
    });
    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('ada@example.com');
    expect(result.user).not.toHaveProperty('password');
  });

  it('rejects a duplicate email', async () => {
    users.findByEmail.mockResolvedValue(user);

    await expect(
      service.register({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'password1',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with a valid password', async () => {
    users.findByEmail.mockResolvedValue(user);
    vi.mocked(bcrypt.compare).mockResolvedValue(true);

    const result = await service.login({
      email: 'ada@example.com',
      password: 'password1',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.id).toBe(user.id);
  });

  it('rejects an invalid password', async () => {
    users.findByEmail.mockResolvedValue(user);
    vi.mocked(bcrypt.compare).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'ada@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
