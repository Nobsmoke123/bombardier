import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  FOLDER_RULES,
  STORAGE_FOLDERS,
  type StorageFolder,
} from './storage.constants.js';

export function isStorageFolder(value: string): value is StorageFolder {
  return (STORAGE_FOLDERS as readonly string[]).includes(value);
}

export function buildObjectKey(userId: string, folder: StorageFolder): string {
  return `users/${userId}/${folder}/${randomUUID()}.${FOLDER_RULES[folder].extension}`;
}

export function assertOwnedObjectKey(userId: string, key: string): void {
  if (
    !key ||
    key.includes('..') ||
    key.includes('\\') ||
    key.startsWith('/') ||
    key.includes('//')
  ) {
    throw new BadRequestException('Invalid object key');
  }

  const prefix = `users/${userId}/`;
  if (!key.startsWith(prefix)) {
    throw new ForbiddenException('You cannot access this object');
  }

  const rest = key.slice(prefix.length);
  const folder = rest.split('/')[0];
  if (!isStorageFolder(folder) || rest === folder) {
    throw new ForbiddenException('You cannot access this object');
  }
}

export function assertUploadMatchesFolder(
  folder: StorageFolder,
  filename: string,
  contentType: string,
): void {
  const rules = FOLDER_RULES[folder];
  const normalizedName = filename.trim().toLowerCase();
  const expectedSuffix = `.${rules.extension}`;

  if (!normalizedName.endsWith(expectedSuffix) || normalizedName.includes('/')) {
    throw new BadRequestException(
      `Expected a ${rules.extension.toUpperCase()} file for ${folder}`,
    );
  }

  if (!rules.contentTypes.includes(contentType.toLowerCase())) {
    throw new BadRequestException(
      `Unsupported content type for ${folder}: ${contentType}`,
    );
  }
}
