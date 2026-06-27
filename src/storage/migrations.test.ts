import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialAppState } from "../domain/progress";
import type { AppState } from "../domain/types";
import { loadAppState, saveAppState, STORAGE_KEY } from "./localStore";
import { migrateAppState } from "./migrations";

describe("storage migrations", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns default state when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(loadAppState()).toEqual(createInitialAppState());
  });

  it("returns default state when localStorage is empty", () => {
    installLocalStorage();

    expect(loadAppState()).toEqual(createInitialAppState());
  });

  it("returns default state when localStorage contains invalid JSON", () => {
    installLocalStorage({ [STORAGE_KEY]: "{not-json" });

    expect(loadAppState()).toEqual(createInitialAppState());
  });

  it("keeps persisted settings when loading app state", () => {
    const state = migrateAppState({
      version: 1,
      progress: {
        version: 1,
        operationStats: {},
      },
      rewards: {
        stars: 4,
        totalStarsEarned: 4,
        stickersUnlocked: [],
        badgesUnlocked: [],
        sessionsCompleted: 0,
        practiceDates: [],
        dailyMissionCompletions: {},
      },
      settings: {
        selectedTables: [6, 7],
        soundEnabled: true,
        animationsEnabled: false,
      },
    });

    expect(state.settings).toEqual({
      selectedTables: [6, 7],
      soundEnabled: true,
      animationsEnabled: false,
    });
  });

  it("persists settings through save and load", () => {
    installLocalStorage();
    const state = createInitialAppState();
    const nextState: AppState = {
      ...state,
      settings: {
        selectedTables: [6, 7],
        soundEnabled: true,
        animationsEnabled: false,
      },
    };

    saveAppState(nextState);

    expect(loadAppState().settings).toEqual(nextState.settings);
  });
});

function installLocalStorage(initialValues: Record<string, string> = {}) {
  const store = new Map(Object.entries(initialValues));
  const localStorageMock = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  } satisfies Storage;

  vi.stubGlobal("localStorage", localStorageMock);
}
