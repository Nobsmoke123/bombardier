import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from './storage.service.js';

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn(),
}));

describe('StorageService', () => {
  let service: StorageService;
  const userId = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    vi.mocked(getSignedUrl).mockResolvedValue('https://r2.example/signed');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: (name: string) =>
              ({
                R2_ACCESS_KEY_ID: 'key',
                R2_SECRET_ACCESS_KEY: 'secret',
                R2_BUCKET: 'job-tracker',
                R2_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
              })[name],
          },
        },
      ],
    }).compile();

    service = module.get(StorageService);
  });

  it('returns a presigned upload URL and object key', async () => {
    const result = await service.presignUpload(
      userId,
      'resumes',
      'backend.pdf',
      'application/pdf',
    );

    expect(result.uploadUrl).toBe('https://r2.example/signed');
    expect(result.key).toMatch(
      new RegExp(`^users/${userId}/resumes/[0-9a-f-]{36}\\.pdf$`),
    );
    expect(result.headers).toEqual({ 'Content-Type': 'application/pdf' });
    expect(result.expiresIn).toBe(300);
    expect(getSignedUrl).toHaveBeenCalled();
  });

  it('returns a 15-minute view URL for an owned key', async () => {
    const key = `users/${userId}/resumes/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.pdf`;
    const result = await service.presignView(userId, key);

    expect(result.viewUrl).toBe('https://r2.example/signed');
    expect(result.key).toBe(key);
    expect(result.expiresIn).toBe(900);
  });
});
