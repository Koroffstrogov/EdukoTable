import { describe, expect, it } from "vitest";
import { createInitialAppState, recordOperationAnswer } from "./progress";
import {
  finalizeAbandonedSessionRewards,
  finalizeSessionRewards,
  grantAnswerReward,
} from "./rewards";
import type { SessionResult } from "./types";

describe("immediate answer rewards", () => {
  it("credits correct answers without removing stars after mistakes", () => {
    const initial = createInitialAppState().rewards;
    const correct = grantAnswerReward(initial, true);
    expect(correct.stars).toBe(1);
    expect(correct.totalStarsEarned).toBe(1);
    expect(initial.stars).toBe(0);
    expect(grantAnswerReward(correct, false)).toEqual(correct);
  });

  it.each([4, 6] as const)("preserves the full %i-choice reward total without double credit", (choiceCount) => {
    const initial = createInitialAppState();
    let progress = initial.progress;
    let rewards = initial.rewards;
    for (let index = 0; index < 10; index += 1) {
      progress = recordOperationAnswer(progress, "6x7", true);
      rewards = grantAnswerReward(rewards, true);
    }
    const result: SessionResult = {
      total: 10, correctCount: 10, wrongOperations: [], fixedDifficultOperations: [],
    };
    const completedAt = "2026-09-23T10:00:00Z";
    const expected = finalizeSessionRewards(initial.rewards, progress, result, completedAt, { choiceCount });
    const actual = finalizeSessionRewards(rewards, progress, result, completedAt, {
      choiceCount, answerStarsAlreadyGranted: true,
    });
    expect(actual).toEqual(expected);
    expect(actual.grant.stars).toBe(38);
    expect(actual.rewards.stars).toBe(38);
    expect(actual.rewards.totalStarsEarned).toBe(38);
  });

  it("keeps partial stars on abandonment without granting completion rewards", () => {
    const initial = createInitialAppState().rewards;
    const credited = grantAnswerReward(grantAnswerReward(initial, true), true);
    const result: SessionResult = {
      total: 3, correctCount: 2, wrongOperations: [], fixedDifficultOperations: [],
    };
    const abandoned = finalizeAbandonedSessionRewards(credited, result, { answerStarsAlreadyGranted: true });
    expect(abandoned.rewards).toEqual(credited);
    expect(abandoned.grant).toEqual({ stars: 2, stickerIds: [], cardIds: [], badgeIds: [] });
    expect(abandoned.rewards.sessionsCompleted).toBe(0);
  });
});
