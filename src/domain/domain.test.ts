import { describe, expect, it } from "vitest";
import { buildAllOperations, getOperationKey } from "./operations";
import {
  getDifficultOperationSummaries,
  getOperationStatus,
  getSuccessRate,
  getTableProgressSummaries,
  isDifficultOperationFixed,
  resetAdventure,
  resetResults,
  updateOperationStats,
} from "./progress";
import {
  finalizeSessionRewards,
  isOperationMastered,
  isTableMastered,
} from "./rewards";
import { getOperationsForTable, buildOperationPool } from "./tableSelection";
import type { Factor, OperationStats, QuestionHistoryItem, RewardState, SessionResult } from "./types";
import {
  generateChoices,
  generateQuestion,
  getChoicesFingerprint,
  getTrainingWeight,
  pickRandomOperation,
  toQuestionHistoryItem,
} from "./questionEngine";

describe("operations", () => {
  it("builds 81 ordered operations with unique keys", () => {
    const operations = buildAllOperations();
    const keys = new Set(operations.map((operation) => operation.key));

    expect(operations).toHaveLength(81);
    expect(keys.size).toBe(81);
    expect(keys.has("6x7")).toBe(true);
    expect(keys.has("7x6")).toBe(true);
  });

  it("keeps ordered keys and shared commutative pair keys", () => {
    const operations = buildAllOperations();
    const sixBySeven = operations.find((operation) => operation.key === "6x7");
    const sevenBySix = operations.find((operation) => operation.key === "7x6");

    expect(sixBySeven?.key).not.toBe(sevenBySix?.key);
    expect(sixBySeven?.pairKey).toBe(sevenBySix?.pairKey);
  });
});

describe("table selection", () => {
  it("includes operations where the selected table is on either side", () => {
    const pool = buildOperationPool([6]);
    const keys = new Set(pool.map((operation) => operation.key));

    expect(keys.has("6x7")).toBe(true);
    expect(keys.has("7x6")).toBe(true);
    expect(keys.has("7x8")).toBe(false);
  });

  it("supports multiple selected tables", () => {
    const pool = buildOperationPool([2, 3]);
    const keys = new Set(pool.map((operation) => operation.key));

    expect(keys.has("2x10")).toBe(true);
    expect(keys.has("10x3")).toBe(true);
    expect(keys.has("3x8")).toBe(true);
    expect(keys.has("8x9")).toBe(false);
  });
});

describe("answer choices", () => {
  it("generates four unique plausible choices for every operation", () => {
    const operations = buildAllOperations();

    for (const operation of operations) {
      const choices = generateChoices(operation, [], seededRandom(42));
      const correctAnswer = operation.a * operation.b;

      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(correctAnswer);
      expect(choices.every((choice) => choice > 0)).toBe(true);
      expect(choices.every((choice) => choice <= 100)).toBe(true);
      expect(choices.every((choice) => Number.isInteger(choice))).toBe(true);
    }
  });

  it("avoids absurdly distant distractors when credible choices exist", () => {
    const operation = buildAllOperations().find(
      (candidate) => candidate.key === "6x3",
    );

    if (!operation) throw new Error("Missing operation 6x3");

    const choices = generateChoices(operation, [], seededRandom(12));

    expect(choices).toContain(18);
    expect(choices).not.toContain(100);
    expect(choices.every((choice) => Math.abs(choice - 18) <= 25)).toBe(true);
  });

  it("builds fingerprints independent of answer order", () => {
    expect(getChoicesFingerprint([36, 42, 48, 49])).toBe("36|42|48|49");
    expect(getChoicesFingerprint([42, 49, 36, 48])).toBe("36|42|48|49");
  });
});

describe("question anti-repetition", () => {
  it("avoids immediate operation, choice, answer, and index repetition when possible", () => {
    const config = {
      mode: "random" as const,
      selectedTables: [6] as Factor[],
      questionCount: 10,
    };
    const history: QuestionHistoryItem[] = [];
    const rng = seededRandom(7);

    for (let index = 0; index < 10; index += 1) {
      const question = generateQuestion(config, {}, history, rng);
      const item = toQuestionHistoryItem(question);
      const previous = history.at(-1);
      const previousTwo = history.slice(-2);

      if (previous) {
        expect(item.operationKey).not.toBe(previous.operationKey);
        expect(item.choicesFingerprint).not.toBe(previous.choicesFingerprint);
      }

      if (
        previousTwo.length === 2 &&
        previousTwo[0].correctAnswer === previousTwo[1].correctAnswer
      ) {
        expect(item.correctAnswer).not.toBe(previousTwo[0].correctAnswer);
      }

      if (
        previousTwo.length === 2 &&
        previousTwo[0].correctChoiceIndex === previousTwo[1].correctChoiceIndex
      ) {
        expect(item.correctChoiceIndex).not.toBe(previousTwo[0].correctChoiceIndex);
      }

      history.push(item);
    }
  });

  it("avoids the last 3 operation keys when the pool allows it", () => {
    const history: QuestionHistoryItem[] = [
      historyItem("6x2", "2x6", 12, [10, 12, 14, 18], 1),
      historyItem("6x3", "3x6", 18, [12, 18, 21, 24], 1),
      historyItem("6x4", "4x6", 24, [18, 21, 24, 30], 2),
    ];
    const config = {
      mode: "random" as const,
      selectedTables: [6] as Factor[],
      questionCount: 10,
    };
    const question = generateQuestion(config, {}, history, seededRandom(2));
    const recentKeys = new Set(history.map((item) => item.operationKey));

    expect(recentKeys.has(question.operation.key)).toBe(false);
  });

  it("avoids the immediate commutative pair when the pool allows it", () => {
    const config = {
      mode: "random" as const,
      selectedTables: [6, 7] as Factor[],
      questionCount: 10,
    };
    const history = [
      historyItem("6x7", "6x7", 42, [35, 36, 42, 48], 2),
    ];
    const question = generateQuestion(config, {}, history, seededRandom(4));

    expect(question.operation.pairKey).not.toBe("6x7");
  });

  it("falls back cleanly when the operation pool is too small", () => {
    const operation = buildAllOperations().find(
      (candidate) => candidate.key === "6x7",
    );

    if (!operation) throw new Error("Missing operation 6x7");

    const history = [
      historyItem("6x7", "6x7", 42, [35, 36, 42, 48], 2),
    ];
    const picked = pickRandomOperation([operation], history, seededRandom(1));

    expect(picked.key).toBe("6x7");
  });

  it("keeps training mode anti-repetition after weighting", () => {
    const config = {
      mode: "training" as const,
      selectedTables: [6] as Factor[],
      questionCount: 10,
    };
    const firstQuestion = generateQuestion(config, {}, [], seededRandom(1));
    const history = [toQuestionHistoryItem(firstQuestion)];
    const secondQuestion = generateQuestion(config, {}, history, seededRandom(1));

    expect(secondQuestion.operation.key).not.toBe(firstQuestion.operation.key);
  });
});

describe("progress", () => {
  it("creates stats for a first correct answer", () => {
    expect(updateOperationStats(undefined, true, "2026-06-27T10:00:00.000Z")).toEqual({
      attempts: 1,
      correct: 1,
      wrong: 0,
      lastResult: "correct",
      lastAnsweredAt: "2026-06-27T10:00:00.000Z",
    });
  });

  it("creates stats for a first wrong answer", () => {
    expect(updateOperationStats(undefined, false, "2026-06-27T10:00:00.000Z")).toEqual({
      attempts: 1,
      correct: 0,
      wrong: 1,
      lastResult: "wrong",
      lastAnsweredAt: "2026-06-27T10:00:00.000Z",
    });
  });

  it("increments following answers and derives rates/status", () => {
    const first = updateOperationStats(undefined, true);
    const second = updateOperationStats(first, false);
    const third = updateOperationStats(second, true);
    const fourth = updateOperationStats(third, true);

    expect(fourth).toMatchObject({ attempts: 4, correct: 3, wrong: 1 });
    expect(getSuccessRate(fourth)).toBe(0.75);
    expect(getSuccessRate(undefined)).toBeNull();
    expect(getSuccessRate({ attempts: 0, correct: 0, wrong: 0 })).toBeNull();
    expect(getOperationStatus(undefined)).toBe("new");
    expect(getOperationStatus({ attempts: 2, correct: 2, wrong: 0 })).toBe(
      "discovering",
    );
    expect(getOperationStatus({ attempts: 5, correct: 2, wrong: 3 })).toBe(
      "difficult",
    );
    expect(getOperationStatus({ attempts: 4, correct: 3, wrong: 1 })).toBe(
      "fragile",
    );
    expect(getOperationStatus({ attempts: 5, correct: 5, wrong: 0 })).toBe(
      "strong",
    );
  });

  it("detects a fixed difficult operation", () => {
    const previous: OperationStats = {
      attempts: 4,
      correct: 3,
      wrong: 1,
      lastResult: "wrong",
    };
    const next = updateOperationStats(previous, true);

    expect(isDifficultOperationFixed(previous, next, true)).toBe(true);
  });

  it("summarizes table progress and difficult operations", () => {
    const statsByKey = {
      "6x7": { attempts: 5, correct: 2, wrong: 3 },
      "7x6": { attempts: 4, correct: 3, wrong: 1 },
      "2x2": { attempts: 3, correct: 3, wrong: 0 },
    };
    const tableSix = getTableProgressSummaries(statsByKey).find(
      (summary) => summary.table === 6,
    );
    const difficult = getDifficultOperationSummaries(statsByKey, 2);

    expect(tableSix).toMatchObject({
      attempts: 9,
      correct: 5,
      wrong: 4,
    });
    expect(tableSix?.successRate).toBeCloseTo(5 / 9);
    expect(difficult[0].operation.key).toBe("6x7");
  });
});

describe("training weights", () => {
  it("prioritizes new and recently wrong operations", () => {
    const strong: OperationStats = {
      attempts: 5,
      correct: 5,
      wrong: 0,
      lastResult: "correct",
    };
    const wrongRecently: OperationStats = {
      attempts: 5,
      correct: 2,
      wrong: 3,
      lastResult: "wrong",
    };

    expect(getTrainingWeight(undefined)).toBeGreaterThan(getTrainingWeight(strong));
    expect(getTrainingWeight(wrongRecently)).toBeGreaterThan(
      getTrainingWeight({ ...wrongRecently, lastResult: "correct" }),
    );
    expect(
      getTrainingWeight({ attempts: 5, correct: 2, wrong: 3 }),
    ).toBeGreaterThan(getTrainingWeight({ attempts: 4, correct: 3, wrong: 1 }));
  });
});

describe("rewards", () => {
  it("grants completion, correct-answer, and perfect bonuses", () => {
    const result: SessionResult = {
      total: 10,
      correctCount: 10,
      wrongOperations: [],
      fixedDifficultOperations: [],
    };
    const initial = resetAdventure();
    const finalized = finalizeSessionRewards(
      initial.rewards,
      initial.progress,
      result,
      "2026-06-27T10:00:00.000Z",
    );

    expect(finalized.grant.stars).toBeGreaterThanOrEqual(18);
    expect(finalized.grant.stickerIds.length).toBeGreaterThanOrEqual(1);
    expect(finalized.grant.badgeIds).toContain("first-session");
    expect(finalized.grant.badgeIds).toContain("first-perfect-session");
    expect(finalized.rewards.sessionsCompleted).toBe(1);
  });

  it("unlocks first-session badge only once", () => {
    const result: SessionResult = {
      total: 10,
      correctCount: 8,
      wrongOperations: [],
      fixedDifficultOperations: [],
    };
    const initial = resetAdventure();
    const first = finalizeSessionRewards(initial.rewards, initial.progress, result);
    const second = finalizeSessionRewards(first.rewards, initial.progress, result);

    expect(first.grant.badgeIds).toContain("first-session");
    expect(second.grant.badgeIds).not.toContain("first-session");
  });

  it("detects operation and table mastery", () => {
    const masteredStats: OperationStats = {
      attempts: 3,
      correct: 3,
      wrong: 0,
    };
    const tableStats = Object.fromEntries(
      getOperationsForTable(6).map((operation) => [operation.key, masteredStats]),
    );

    expect(isOperationMastered(masteredStats)).toBe(true);
    expect(isTableMastered(6, tableStats)).toBe(true);
  });

  it("unlocks a mastered table badge once", () => {
    const initial = resetAdventure();
    const tableStats = Object.fromEntries(
      getOperationsForTable(6).map((operation) => [
        operation.key,
        { attempts: 3, correct: 3, wrong: 0 },
      ]),
    );
    const progress = {
      ...initial.progress,
      operationStats: tableStats,
    };
    const result: SessionResult = {
      total: 10,
      correctCount: 8,
      wrongOperations: [],
      fixedDifficultOperations: [],
    };
    const first = finalizeSessionRewards(initial.rewards, progress, result);
    const secondRewards: RewardState = {
      ...first.rewards,
      badgesUnlocked: [...first.rewards.badgesUnlocked, "table-6-mastered"],
    };
    const second = finalizeSessionRewards(secondRewards, progress, result);

    expect(first.grant.badgeIds).toContain("table-6-mastered");
    expect(second.grant.badgeIds).not.toContain("table-6-mastered");
  });

  it("separates reset results from reset adventure", () => {
    const state = resetAdventure();
    const rewarded = {
      ...state,
      progress: {
        ...state.progress,
        operationStats: {
          [getOperationKey(6, 7)]: { attempts: 1, correct: 1, wrong: 0 },
        },
      },
      rewards: {
        ...state.rewards,
        stars: 20,
        totalStarsEarned: 20,
        stickersUnlocked: ["forest-leaf"],
        badgesUnlocked: ["first-session"],
        sessionsCompleted: 2,
      },
    };
    const resultsReset = resetResults(rewarded);
    const adventureReset = resetAdventure();

    expect(resultsReset.progress.operationStats).toEqual({});
    expect(resultsReset.rewards.stars).toBe(20);
    expect(resultsReset.rewards.stickersUnlocked).toEqual(["forest-leaf"]);
    expect(resultsReset.rewards.badgesUnlocked).toEqual(["first-session"]);
    expect(resultsReset.settings).toEqual(rewarded.settings);
    expect(adventureReset.rewards.stars).toBe(0);
    expect(adventureReset.rewards.stickersUnlocked).toEqual([]);
    expect(adventureReset.rewards.badgesUnlocked).toEqual([]);
    expect(adventureReset.settings.selectedTables).toEqual([2, 3, 4, 5]);
  });
});

function historyItem(
  operationKey: string,
  pairKey: string,
  correctAnswer: number,
  choices: number[],
  correctChoiceIndex: number,
): QuestionHistoryItem {
  return {
    operationKey,
    pairKey,
    correctAnswer,
    choicesFingerprint: getChoicesFingerprint(choices),
    correctChoiceIndex,
  };
}

function seededRandom(seed: number): () => number {
  let value = seed % 2_147_483_647;

  return () => {
    value = (value * 16_807) % 2_147_483_647;
    return (value - 1) / 2_147_483_646;
  };
}
