import { buildAllOperations } from "./operations";
import { getOperationsForTable } from "./tableSelection";
import {
  FACTORS,
  type Badge,
  type Factor,
  type OperationStats,
  type ProgressState,
  type RewardGrant,
  type RewardState,
  type SessionResult,
  type Sticker,
} from "./types";

export const STICKERS: Sticker[] = [
  {
    id: "forest-leaf",
    collectionId: "forest",
    label: "Feuille brillante",
    symbol: "L1",
    rarity: "common",
  },
  {
    id: "forest-tree",
    collectionId: "forest",
    label: "Grand arbre",
    symbol: "T1",
    rarity: "common",
  },
  {
    id: "space-rocket",
    collectionId: "space",
    label: "Fusee Eduko",
    symbol: "R1",
    rarity: "common",
  },
  {
    id: "space-planet",
    collectionId: "space",
    label: "Planete calme",
    symbol: "P1",
    rarity: "common",
  },
  {
    id: "ocean-shell",
    collectionId: "ocean",
    label: "Coquillage bleu",
    symbol: "C1",
    rarity: "common",
  },
  {
    id: "machine-gear",
    collectionId: "machine",
    label: "Roue magique",
    symbol: "G1",
    rarity: "common",
  },
  {
    id: "perfect-spark",
    collectionId: "special",
    label: "Session parfaite",
    symbol: "S1",
    rarity: "special",
  },
  ...FACTORS.map((factor) => ({
    id: `table-${factor}-spark`,
    collectionId: "mastery",
    label: `Table ${factor} maitrisee`,
    symbol: `M${factor}`,
    rarity: "special" as const,
  })),
];

export const BADGES: Badge[] = [
  { id: "first-session", label: "Premiere mission", starBonus: 5 },
  { id: "first-perfect-session", label: "Mission parfaite", starBonus: 10 },
  ...FACTORS.map((factor) => ({
    id: `table-${factor}-mastered`,
    label: `Table ${factor} maitrisee`,
    starBonus: 10,
  })),
  { id: "ten-correct-answers", label: "10 bonnes reponses", starBonus: 5 },
  { id: "fifty-correct-answers", label: "50 bonnes reponses", starBonus: 10 },
  { id: "hundred-answers", label: "100 reponses", starBonus: 15 },
  {
    id: "difficult-operation-fixed",
    label: "Difficulte transformee",
    starBonus: 5,
  },
];

export function createInitialRewardState(): RewardState {
  return {
    stars: 0,
    totalStarsEarned: 0,
    stickersUnlocked: [],
    badgesUnlocked: [],
    sessionsCompleted: 0,
    practiceDates: [],
    dailyMissionCompletions: {},
  };
}

export function createEmptyRewardGrant(): RewardGrant {
  return {
    stars: 0,
    stickerIds: [],
    badgeIds: [],
  };
}

export function computeSessionReward(result: SessionResult): RewardGrant {
  const starsForCorrectAnswers = result.correctCount;
  const completionBonus = result.total > 0 ? 3 : 0;
  const perfectBonus = result.total > 0 && result.correctCount === result.total ? 5 : 0;
  const fixedDifficultyBonus = result.fixedDifficultOperations.length * 2;

  return {
    stars:
      starsForCorrectAnswers +
      completionBonus +
      perfectBonus +
      fixedDifficultyBonus,
    stickerIds: [],
    badgeIds: [],
  };
}

export function isOperationMastered(stats?: OperationStats): boolean {
  if (!stats || stats.attempts < 3) return false;
  return stats.correct / stats.attempts >= 0.8;
}

export function isTableMastered(
  table: Factor,
  statsByKey: Record<string, OperationStats>,
): boolean {
  return getOperationsForTable(table).every((operation) =>
    isOperationMastered(statsByKey[operation.key]),
  );
}

export function getTotalCorrectAnswers(
  statsByKey: Record<string, OperationStats>,
): number {
  return Object.values(statsByKey).reduce(
    (total, stats) => total + stats.correct,
    0,
  );
}

export function getTotalAnswers(
  statsByKey: Record<string, OperationStats>,
): number {
  return Object.values(statsByKey).reduce(
    (total, stats) => total + stats.attempts,
    0,
  );
}

export function getStickerById(stickerId: string): Sticker | undefined {
  return STICKERS.find((sticker) => sticker.id === stickerId);
}

export function getBadgeById(badgeId: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === badgeId);
}

export function mergeRewardGrants(
  left: RewardGrant,
  right: RewardGrant,
): RewardGrant {
  return {
    stars: left.stars + right.stars,
    stickerIds: unique([...left.stickerIds, ...right.stickerIds]),
    badgeIds: unique([...left.badgeIds, ...right.badgeIds]),
  };
}

export function applyRewardGrant(
  rewardState: RewardState,
  grant: RewardGrant,
): RewardState {
  const stickerIds = unique([
    ...rewardState.stickersUnlocked,
    ...grant.stickerIds,
  ]);
  const badgeIds = unique([...rewardState.badgesUnlocked, ...grant.badgeIds]);

  return {
    ...rewardState,
    stars: rewardState.stars + grant.stars,
    totalStarsEarned: rewardState.totalStarsEarned + grant.stars,
    stickersUnlocked: stickerIds,
    badgesUnlocked: badgeIds,
  };
}

export function evaluateRewardMilestones(
  previousRewards: RewardState,
  nextProgress: ProgressState,
  result: SessionResult,
): RewardGrant {
  const grant = createEmptyRewardGrant();
  const commonSticker = STICKERS.find(
    (sticker) =>
      sticker.rarity === "common" &&
      !previousRewards.stickersUnlocked.includes(sticker.id),
  );

  if (commonSticker) {
    grant.stickerIds.push(commonSticker.id);
  }

  if (
    result.total > 0 &&
    result.correctCount === result.total &&
    !previousRewards.stickersUnlocked.includes("perfect-spark")
  ) {
    grant.stickerIds.push("perfect-spark");
  }

  addBadgeOnce(grant, previousRewards, "first-session");

  if (result.total > 0 && result.correctCount === result.total) {
    addBadgeOnce(grant, previousRewards, "first-perfect-session");
  }

  if (result.fixedDifficultOperations.length > 0) {
    addBadgeOnce(grant, previousRewards, "difficult-operation-fixed");
  }

  const totalCorrect = getTotalCorrectAnswers(nextProgress.operationStats);
  const totalAnswers = getTotalAnswers(nextProgress.operationStats);

  if (totalCorrect >= 10) {
    addBadgeOnce(grant, previousRewards, "ten-correct-answers");
  }

  if (totalCorrect >= 50) {
    addBadgeOnce(grant, previousRewards, "fifty-correct-answers");
  }

  if (totalAnswers >= 100) {
    addBadgeOnce(grant, previousRewards, "hundred-answers");
  }

  for (const factor of FACTORS) {
    if (isTableMastered(factor, nextProgress.operationStats)) {
      addBadgeOnce(grant, previousRewards, `table-${factor}-mastered`);
      addStickerOnce(grant, previousRewards, `table-${factor}-spark`);
    }
  }

  grant.stars += grant.badgeIds.reduce((total, badgeId) => {
    return total + (getBadgeById(badgeId)?.starBonus ?? 0);
  }, 0);

  grant.stickerIds = unique(grant.stickerIds);
  grant.badgeIds = unique(grant.badgeIds);

  return grant;
}

export function finalizeSessionRewards(
  previousRewards: RewardState,
  nextProgress: ProgressState,
  result: SessionResult,
  completedAt = new Date().toISOString(),
): { rewards: RewardState; grant: RewardGrant } {
  const practiceDate = completedAt.slice(0, 10);
  const rewardsWithSession = {
    ...previousRewards,
    sessionsCompleted: previousRewards.sessionsCompleted + 1,
    practiceDates: unique([...previousRewards.practiceDates, practiceDate]),
    lastPracticeDate: practiceDate,
  };
  const baseGrant = computeSessionReward(result);
  const milestoneGrant = evaluateRewardMilestones(
    previousRewards,
    nextProgress,
    result,
  );
  const grant = mergeRewardGrants(baseGrant, milestoneGrant);

  return {
    rewards: applyRewardGrant(rewardsWithSession, grant),
    grant,
  };
}

export function buildSessionResult(
  answers: {
    operation: { key: string; a: number; b: number };
    wasCorrect: boolean;
    fixedDifficultOperation: boolean;
  }[],
): SessionResult {
  const wrongOperations = answers
    .filter((answer) => !answer.wasCorrect)
    .map((answer) => {
      const operation = buildAllOperations().find(
        (candidate) => candidate.key === answer.operation.key,
      );

      if (!operation) {
        throw new Error(`Unknown operation ${answer.operation.key}`);
      }

      return operation;
    });
  const fixedDifficultOperations = answers
    .filter((answer) => answer.fixedDifficultOperation)
    .map((answer) => {
      const operation = buildAllOperations().find(
        (candidate) => candidate.key === answer.operation.key,
      );

      if (!operation) {
        throw new Error(`Unknown operation ${answer.operation.key}`);
      }

      return operation;
    });

  return {
    total: answers.length,
    correctCount: answers.filter((answer) => answer.wasCorrect).length,
    wrongOperations,
    fixedDifficultOperations,
  };
}

function addBadgeOnce(
  grant: RewardGrant,
  rewards: RewardState,
  badgeId: string,
): void {
  if (
    !rewards.badgesUnlocked.includes(badgeId) &&
    !grant.badgeIds.includes(badgeId)
  ) {
    grant.badgeIds.push(badgeId);
  }
}

function addStickerOnce(
  grant: RewardGrant,
  rewards: RewardState,
  stickerId: string,
): void {
  if (
    !rewards.stickersUnlocked.includes(stickerId) &&
    !grant.stickerIds.includes(stickerId)
  ) {
    grant.stickerIds.push(stickerId);
  }
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
