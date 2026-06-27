import { createInitialRewardState } from "./rewards";
import { DEFAULT_SELECTED_TABLES } from "./tableSelection";
import { buildAllOperations } from "./operations";
import { getOperationsForTable } from "./tableSelection";
import { FACTORS } from "./types";
import type {
  AppState,
  Factor,
  OperationProgressSummary,
  OperationStats,
  OperationStatus,
  ProgressState,
  SettingsState,
  TableProgressSummary,
} from "./types";

export const APP_STATE_VERSION = 1;
export const PROGRESS_STATE_VERSION = 1;

export function createInitialProgressState(): ProgressState {
  return {
    version: PROGRESS_STATE_VERSION,
    operationStats: {},
  };
}

export function createDefaultSettings(): SettingsState {
  return {
    selectedTables: DEFAULT_SELECTED_TABLES,
    soundEnabled: false,
    animationsEnabled: true,
  };
}

export function createInitialAppState(): AppState {
  return {
    version: APP_STATE_VERSION,
    progress: createInitialProgressState(),
    rewards: createInitialRewardState(),
    settings: createDefaultSettings(),
  };
}

export function updateOperationStats(
  stats: OperationStats | undefined,
  wasCorrect: boolean,
  answeredAt = new Date().toISOString(),
): OperationStats {
  const current = stats ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
  };

  return {
    attempts: current.attempts + 1,
    correct: current.correct + (wasCorrect ? 1 : 0),
    wrong: current.wrong + (wasCorrect ? 0 : 1),
    lastResult: wasCorrect ? "correct" : "wrong",
    lastAnsweredAt: answeredAt,
  };
}

export function recordOperationAnswer(
  progress: ProgressState,
  operationKey: string,
  wasCorrect: boolean,
  answeredAt = new Date().toISOString(),
): ProgressState {
  return {
    ...progress,
    operationStats: {
      ...progress.operationStats,
      [operationKey]: updateOperationStats(
        progress.operationStats[operationKey],
        wasCorrect,
        answeredAt,
      ),
    },
  };
}

export function getSuccessRate(stats?: OperationStats): number | null {
  if (!stats || stats.attempts === 0) return null;
  return stats.correct / stats.attempts;
}

export function getOperationStatus(stats?: OperationStats): OperationStatus {
  if (!stats || stats.attempts === 0) return "new";
  if (stats.attempts < 3) return "discovering";

  const rate = stats.correct / stats.attempts;

  if (rate < 0.6) return "difficult";
  if (rate < 0.8) return "fragile";
  return "strong";
}

export function isDifficultOperationFixed(
  previousStats: OperationStats | undefined,
  nextStats: OperationStats,
  wasCorrect: boolean,
): boolean {
  if (!wasCorrect || nextStats.attempts < 3) return false;

  const previousStatus = getOperationStatus(previousStats);
  const nextRate = getSuccessRate(nextStats);

  return (
    (previousStatus === "difficult" || previousStatus === "fragile") &&
    nextRate !== null &&
    nextRate >= 0.8
  );
}

export function getTableProgressSummary(
  table: Factor,
  statsByKey: Record<string, OperationStats>,
): TableProgressSummary {
  const operations = getOperationsForTable(table);
  const totals = operations.reduce(
    (summary, operation) => {
      const stats = statsByKey[operation.key];

      if (!stats) return summary;

      return {
        attempts: summary.attempts + stats.attempts,
        correct: summary.correct + stats.correct,
        wrong: summary.wrong + stats.wrong,
      };
    },
    { attempts: 0, correct: 0, wrong: 0 },
  );

  return {
    table,
    ...totals,
    successRate:
      totals.attempts > 0 ? totals.correct / totals.attempts : null,
  };
}

export function getTableProgressSummaries(
  statsByKey: Record<string, OperationStats>,
): TableProgressSummary[] {
  return FACTORS.map((table) => getTableProgressSummary(table, statsByKey));
}

export function getDifficultOperationSummaries(
  statsByKey: Record<string, OperationStats>,
  limit = 6,
): OperationProgressSummary[] {
  return buildAllOperations()
    .map((operation) => {
      const stats = statsByKey[operation.key];

      if (!stats || stats.attempts === 0) return null;

      return {
        operation,
        stats,
        successRate: getSuccessRate(stats),
        status: getOperationStatus(stats),
      };
    })
    .filter((summary): summary is OperationProgressSummary => {
      return (
        summary !== null &&
        (summary.stats.wrong > 0 ||
          summary.status === "difficult" ||
          summary.status === "fragile")
      );
    })
    .sort((left, right) => {
      const leftRate = left.successRate ?? 1;
      const rightRate = right.successRate ?? 1;

      if (leftRate !== rightRate) return leftRate - rightRate;
      if (left.stats.wrong !== right.stats.wrong) {
        return right.stats.wrong - left.stats.wrong;
      }

      return right.stats.attempts - left.stats.attempts;
    })
    .slice(0, limit);
}

export function resetResults(state: AppState): AppState {
  return {
    ...state,
    progress: createInitialProgressState(),
  };
}

export function resetAdventure(): AppState {
  return createInitialAppState();
}
