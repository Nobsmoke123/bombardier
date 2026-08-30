import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service.js';
import { SettingsService } from './settings.service.js';

describe('SettingsService', () => {
  let service: SettingsService;
  const users = {
    findById: vi.fn(),
    updateDailyTarget: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: UsersService, useValue: users },
      ],
    }).compile();
    service = module.get(SettingsService);
  });

  it('returns the current daily target', async () => {
    users.findById.mockResolvedValue({ dailyTarget: 20 });
    await expect(service.get('user-1')).resolves.toEqual({ dailyTarget: 20 });
  });

  it('updates the daily target', async () => {
    users.updateDailyTarget.mockResolvedValue({ dailyTarget: 12 });
    await expect(service.update('user-1', 12)).resolves.toEqual({
      dailyTarget: 12,
    });
    expect(users.updateDailyTarget).toHaveBeenCalledWith('user-1', 12);
  });

  it('404s when the user is missing', async () => {
    users.findById.mockResolvedValue(null);
    await expect(service.get('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
