import type {
  CreateResumeRequest,
  PresignViewResponse,
  ResumePublic,
} from "@job-tracker/types";
import { api } from "./api";
import { presignUpload, uploadToR2 } from "./storage";

export function listResumes() {
  return api<ResumePublic[]>("/resumes");
}

export function getResume(id: string) {
  return api<ResumePublic>(`/resumes/${id}`);
}

export function createResume(body: CreateResumeRequest) {
  return api<ResumePublic>("/resumes", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function viewResume(id: string) {
  return api<PresignViewResponse>(`/resumes/${id}/view`);
}

export function deleteResume(id: string) {
  return api<void>(`/resumes/${id}`, { method: "DELETE" });
}

export async function uploadResumePdf(input: {
  title: string;
  focus: CreateResumeRequest["focus"];
  file: File;
}) {
  const presign = await presignUpload({
    folder: "resumes",
    filename: input.file.name,
    contentType: input.file.type || "application/pdf",
  });
  await uploadToR2(input.file, presign);
  return createResume({
    title: input.title,
    focus: input.focus,
    fileKey: presign.key,
  });
}
