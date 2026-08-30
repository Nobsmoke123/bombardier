import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  assertOwnedObjectKey,
  assertUploadMatchesFolder,
  buildObjectKey,
} from './storage.keys.js';

const userId = '11111111-1111-1111-1111-111111111111';

describe('storage.keys', () => {
  it('builds resume keys under the user prefix', () => {
    expect(buildObjectKey(userId, 'resumes')).toMatch(
      new RegExp(
        `^users/${userId}/resumes/[0-9a-f-]{36}\\.pdf$`,
      ),
    );
  });

  it('builds import keys under the user prefix', () => {
    expect(buildObjectKey(userId, 'imports')).toMatch(
      new RegExp(`^users/${userId}/imports/[0-9a-f-]{36}\\.csv$`),
    );
  });

  it('allows a key owned by the user', () => {
    expect(() =>
      assertOwnedObjectKey(userId, `users/${userId}/resumes/file.pdf`),
    ).not.toThrow();
  });

  it('rejects another user key', () => {
    expect(() =>
      assertOwnedObjectKey(userId, 'users/other-user/resumes/file.pdf'),
    ).toThrow(ForbiddenException);
  });

  it('rejects path traversal', () => {
    expect(() =>
      assertOwnedObjectKey(userId, `users/${userId}/resumes/../secrets.pdf`),
    ).toThrow(BadRequestException);
  });

  it('rejects a resume that is not a PDF', () => {
    expect(() =>
      assertUploadMatchesFolder('resumes', 'notes.txt', 'application/pdf'),
    ).toThrow(BadRequestException);
  });

  it('rejects the wrong content type for imports', () => {
    expect(() =>
      assertUploadMatchesFolder('imports', 'companies.csv', 'application/pdf'),
    ).toThrow(BadRequestException);
  });
});
