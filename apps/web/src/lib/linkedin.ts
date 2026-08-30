import type {
  CreateLinkedInContactRequest,
  LinkedInContactPublic,
  UpdateLinkedInContactRequest,
} from "@job-tracker/types";
import { api } from "./api";

export function listLinkedInContacts(applicationId: string) {
  return api<LinkedInContactPublic[]>(`/applications/${applicationId}/linkedin`);
}

export function createLinkedInContact(
  applicationId: string,
  body: CreateLinkedInContactRequest,
) {
  return api<LinkedInContactPublic>(`/applications/${applicationId}/linkedin`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateLinkedInContact(
  id: string,
  body: UpdateLinkedInContactRequest,
) {
  return api<LinkedInContactPublic>(`/linkedin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
