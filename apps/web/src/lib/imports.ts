import type {
  CreateCsvImportRequest,
  CsvImportPublic,
} from "@job-tracker/types";
import { api } from "./api";
import { presignUpload, uploadToR2 } from "./storage";

export function createCsvImport(body: CreateCsvImportRequest) {
  return api<CsvImportPublic>("/companies/import", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listCsvImports() {
  return api<CsvImportPublic[]>("/companies/imports");
}

export async function uploadCompaniesCsv(file: File) {
  const presign = await presignUpload({
    folder: "imports",
    filename: file.name,
    contentType: file.type || "text/csv",
  });
  await uploadToR2(file, presign);
  return createCsvImport({
    filename: file.name,
    objectKey: presign.key,
  });
}
