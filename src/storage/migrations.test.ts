import { describe, expect, it } from "vitest";
import { migrateAppState } from "./migrations";

describe("storage migrations", () => {
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
});
