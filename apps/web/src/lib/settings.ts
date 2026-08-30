import type { SettingsPublic, UpdateSettingsRequest } from "@job-tracker/types";
import { api } from "./api";

export function getSettings() {
  return api<SettingsPublic>("/settings");
}

export function updateSettings(body: UpdateSettingsRequest) {
  return api<SettingsPublic>("/settings", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
