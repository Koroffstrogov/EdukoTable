import {
  APP_STATE_VERSION,
  createDefaultSettings,
  createInitialAppState,
  createInitialProgressState,
} from "../domain/progress";
import { createInitialRewardState } from "../domain/rewards";
import { FACTORS, type AppState, type Factor, type OperationStats } from "../domain/types";

export function migrateAppState(value: unknown): AppState {
  if (!isRecord(value)) {
    return createInitialAppState();
  }

  return {
    version: APP_STATE_VERSION,
    progress: migrateProgressState(value.progress),
    rewards: migrateRewardState(value.rewards),
    settings: migrateSettingsState(value.settings),
  };
}

function migrateProgressState(value: unknown): AppState["progress"] {
  if (!isRecord(value)) {
    return createInitialProgressState();
  }

  return {
    version: 1,
    operationStats: migrateOperationStatsMap(value.operationStats),
  };
}

function migrateRewardState(value: unknown): AppState["rewards"] {
  const defaults = createInitialRewardState();

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    stars: toSafeNumber(value.stars, defaults.stars),
    totalStarsEarned: toSafeNumber(
      value.totalStarsEarned,
      defaults.totalStarsEarned,
    ),
    stickersUnlocked: toStringArray(value.stickersUnlocked),
    badgesUnlocked: toStringArray(value.badgesUnlocked),
    sessionsCompleted: toSafeNumber(
      value.sessionsCompleted,
      defaults.sessionsCompleted,
    ),
    practiceDates: toStringArray(value.practiceDates),
    lastPracticeDate:
      typeof value.lastPracticeDate === "string"
        ? value.lastPracticeDate
        : undefined,
    dailyMissionCompletions: isRecord(value.dailyMissionCompletions)
      ? Object.fromEntries(
          Object.entries(value.dailyMissionCompletions).map(([key, item]) => [
            key,
            toStringArray(item),
          ]),
        )
      : {},
  };
}

function migrateSettingsState(value: unknown): AppState["settings"] {
  const defaults = createDefaultSettings();

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    selectedTables: toFactorArray(value.selectedTables, defaults.selectedTables),
    soundEnabled:
      typeof value.soundEnabled === "boolean"
        ? value.soundEnabled
        : defaults.soundEnabled,
    animationsEnabled:
      typeof value.animationsEnabled === "boolean"
        ? value.animationsEnabled
        : defaults.animationsEnabled,
  };
}

function migrateOperationStatsMap(
  value: unknown,
): Record<string, OperationStats> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, stats]) => [key, migrateOperationStats(stats)] as const)
      .filter((entry): entry is readonly [string, OperationStats] => {
        return entry[1] !== null;
      }),
  );
}

function migrateOperationStats(value: unknown): OperationStats | null {
  if (!isRecord(value)) {
    return null;
  }

  const attempts = toSafeNumber(value.attempts, 0);
  const correct = toSafeNumber(value.correct, 0);
  const wrong = toSafeNumber(value.wrong, 0);

  return {
    attempts,
    correct,
    wrong,
    lastResult:
      value.lastResult === "correct" || value.lastResult === "wrong"
        ? value.lastResult
        : undefined,
    lastAnsweredAt:
      typeof value.lastAnsweredAt === "string"
        ? value.lastAnsweredAt
        : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toSafeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toFactorArray(value: unknown, fallback: Factor[]): Factor[] {
  if (!Array.isArray(value)) return fallback;

  const factors = FACTORS.filter((factor) => value.includes(factor));
  return factors.length > 0 ? factors : fallback;
}
