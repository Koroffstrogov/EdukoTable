import { createInitialAppState } from "../domain/progress";
import type { AppState } from "../domain/types";
import { migrateAppState } from "./migrations";

export const STORAGE_KEY = "edukotable:v1";

export function loadAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialAppState();
    return migrateAppState(JSON.parse(stored));
  } catch {
    return createInitialAppState();
  }
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
