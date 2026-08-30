import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  PresignUploadResponse,
  PresignViewResponse,
} from '@job-tracker/types';
import {
  UPLOAD_EXPIRES_IN,
  VIEW_EXPIRES_IN,
  type StorageFolder,
} from './storage.constants.js';
import {
  assertOwnedObjectKey,
  assertUploadMatchesFolder,
  buildObjectKey,
} from './storage.keys.js';

@Injectable()
export class StorageService {
  private client?: S3Client;
  private bucket?: string;

  constructor(private readonly config: ConfigService) {}

  async presignUpload(
    userId: string,
    folder: StorageFolder,
    filename: string,
    contentType: string,
  ): Promise<PresignUploadResponse> {
    assertUploadMatchesFolder(folder, filename, contentType);
    const key = buildObjectKey(userId, folder);
    const { client, bucket } = this.s3();

    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: UPLOAD_EXPIRES_IN },
    );

    return {
      uploadUrl,
      key,
      headers: { 'Content-Type': contentType },
      expiresIn: UPLOAD_EXPIRES_IN,
    };
  }

  async presignView(userId: string, key: string): Promise<PresignViewResponse> {
    assertOwnedObjectKey(userId, key);
    const { client, bucket } = this.s3();

    const viewUrl = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn: VIEW_EXPIRES_IN },
    );

    return {
      viewUrl,
      key,
      expiresIn: VIEW_EXPIRES_IN,
    };
  }

  async deleteObject(userId: string, key: string): Promise<void> {
    assertOwnedObjectKey(userId, key);
    const { client, bucket } = this.s3();
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  private s3() {
    if (this.client && this.bucket) {
      return { client: this.client, bucket: this.bucket };
    }

    const accessKeyId = required(this.config, 'R2_ACCESS_KEY_ID');
    const secretAccessKey = required(this.config, 'R2_SECRET_ACCESS_KEY');
    const bucket = required(this.config, 'R2_BUCKET');
    const endpoint =
      this.config.get<string>('R2_ENDPOINT') ||
      `https://${required(this.config, 'R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`;

    this.bucket = bucket;
    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    return { client: this.client, bucket };
  }
}

function required(config: ConfigService, name: string): string {
  const value = config.get<string>(name);
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}
