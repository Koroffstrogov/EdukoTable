import { describe, expect, it } from "vitest";
import {
  CHALLENGE_CARDS,
  getChallengeCardProgress,
  isChallengeCardUnlocked,
  selectNextChallengeCard,
} from "./challengeCards";
import { finalizeSessionRewards } from "./rewards";
import { resetAdventure, resetResults } from "./progress";
import type { ChallengeSixProgress } from "./types";

describe("challenge card catalog", () => {
  it("contains six stable cards with a clear rarity path", () => {
    expect(CHALLENGE_CARDS).toHaveLength(6);
    expect(new Set(CHALLENGE_CARDS.map((card) => card.id)).size).toBe(6);
    expect(CHALLENGE_CARDS.map((card) => card.rarity)).toEqual([
      "common",
      "common",
      "common",
      "rare",
      "rare",
      "epic",
    ]);
  });

  it("unlocks cards in order and never skips the next card", () => {
    const progress: ChallengeSixProgress = {
      sessionsCompleted: 5,
      correctAnswers: 40,
      perfectSessions: 0,
    };

    expect(selectNextChallengeCard([], progress)?.id).toBe("hexa-firefly");

    const firstThree = CHALLENGE_CARDS.slice(0, 3).map((card) => card.id);
    expect(selectNextChallengeCard(firstThree, progress)?.id).toBe(
      "boulon-robot",
    );
  });

  it("supports the perfect-session or persistence path for the final card", () => {
    const finalCard = CHALLENGE_CARDS.at(-1);
    if (!finalCard) throw new Error("Missing final challenge card");

    expect(
      isChallengeCardUnlocked(finalCard, {
        sessionsCompleted: 1,
        correctAnswers: 10,
        perfectSessions: 1,
      }),
    ).toBe(true);
    expect(
      isChallengeCardUnlocked(finalCard, {
        sessionsCompleted: 10,
        correctAnswers: 60,
        perfectSessions: 0,
      }),
    ).toBe(true);
    expect(
      isChallengeCardUnlocked(finalCard, {
        sessionsCompleted: 9,
        correctAnswers: 60,
        perfectSessions: 0,
      }),
    ).toBe(false);
  });

  it("reports readable progress for locked cards", () => {
    const card = CHALLENGE_CARDS[2];
    const progress = getChallengeCardProgress(card, {
      sessionsCompleted: 2,
      correctAnswers: 14,
      perfectSessions: 0,
    });

    expect(progress).toMatchObject({
      current: 14,
      target: 20,
      percent: 70,
      label: "Réussis 20 réponses en mode 6 choix",
    });
  });
});

describe("challenge card rewards", () => {
  it("tracks six-choice progress and replaces the routine sticker at a milestone", () => {
    const initial = resetAdventure();
    const result = {
      total: 10,
      correctCount: 8,
      wrongOperations: [],
      fixedDifficultOperations: [],
    };

    const first = finalizeSessionRewards(
      initial.rewards,
      initial.progress,
      result,
      "2026-08-30T10:00:00.000Z",
      { choiceCount: 6 },
    );
    const second = finalizeSessionRewards(
      first.rewards,
      initial.progress,
      result,
      "2026-08-31T10:00:00.000Z",
      { choiceCount: 6 },
    );

    expect(first.grant.cardIds).toEqual(["hexa-firefly"]);
    expect(first.grant.stickerIds).toEqual([]);
    expect(first.rewards.challengeSix).toEqual({
      sessionsCompleted: 1,
      correctAnswers: 8,
      perfectSessions: 0,
    });
    expect(second.grant.cardIds).toEqual(["tempo-turtle"]);
    expect(second.rewards.challengeCardsUnlocked).toEqual([
      "hexa-firefly",
      "tempo-turtle",
    ]);
  });

  it("does not advance challenge cards for standard sessions", () => {
    const initial = resetAdventure();
    const result = {
      total: 10,
      correctCount: 10,
      wrongOperations: [],
      fixedDifficultOperations: [],
    };
    const finalized = finalizeSessionRewards(
      initial.rewards,
      initial.progress,
      result,
    );

    expect(finalized.grant.cardIds).toEqual([]);
    expect(finalized.rewards.challengeSix).toEqual(
      initial.rewards.challengeSix,
    );
  });

  it("keeps cards on results reset and clears them on adventure reset", () => {
    const state = resetAdventure();
    const rewarded = {
      ...state,
      rewards: {
        ...state.rewards,
        challengeCardsUnlocked: ["hexa-firefly"],
        challengeSix: {
          sessionsCompleted: 1,
          correctAnswers: 8,
          perfectSessions: 0,
        },
      },
    };

    expect(resetResults(rewarded).rewards.challengeCardsUnlocked).toEqual([
      "hexa-firefly",
    ]);
    expect(resetResults(rewarded).rewards.challengeSix.sessionsCompleted).toBe(
      1,
    );
    expect(resetAdventure().rewards.challengeCardsUnlocked).toEqual([]);
  });
});
