import type {
  CompanyListResponse,
  CompanyPublic,
  UpdateCompanyRequest,
} from "@job-tracker/types";
import { api } from "./api";

export type CompanyListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: UpdateCompanyRequest["status"];
};

export function listCompanies(query: CompanyListQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  const suffix = params.size ? `?${params.toString()}` : "";
  return api<CompanyListResponse>(`/companies${suffix}`);
}

export function getCompany(id: string) {
  return api<CompanyPublic>(`/companies/${id}`);
}

export function updateCompany(id: string, body: UpdateCompanyRequest) {
  return api<CompanyPublic>(`/companies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
