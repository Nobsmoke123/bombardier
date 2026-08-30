import type {
  PresignUploadRequest,
  PresignUploadResponse,
  PresignViewResponse,
} from "@job-tracker/types";
import { api } from "./api";

export function presignUpload(body: PresignUploadRequest) {
  return api<PresignUploadResponse>("/storage/presign", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function presignView(key: string) {
  const query = new URLSearchParams({ key });
  return api<PresignViewResponse>(`/storage/view?${query.toString()}`);
}

export async function uploadToR2(
  file: File,
  presign: PresignUploadResponse,
): Promise<void> {
  const response = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: presign.headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error("Direct upload to object storage failed");
  }
}
