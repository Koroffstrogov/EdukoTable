import { describe, expect, it } from "vitest";
import { resetAdventure, resetResults } from "./progress";
import {
  STICKERS,
  STICKER_COLLECTIONS,
  finalizeSessionRewards,
  selectNextSessionSticker,
} from "./rewards";
import type { AppState, SessionResult } from "./types";

describe("sticker catalog", () => {
  it("contains 50 stickers across the five v2 collections", () => {
    expect(STICKERS).toHaveLength(50);
    expect(STICKER_COLLECTIONS.map((collection) => collection.label)).toEqual([
      "Forêt Eduko",
      "Espace Eduko",
      "Océan Eduko",
      "Machines rigolotes",
      "Créatures amies",
    ]);
  });

  it("uses unique stable ids and simple rarities", () => {
    const ids = STICKERS.map((sticker) => sticker.id);
    const rarities = new Set(STICKERS.map((sticker) => sticker.rarity));

    expect(new Set(ids).size).toBe(ids.length);
    expect(rarities).toEqual(new Set(["common", "rare", "epic"]));
    expect(ids).toContain("forest-leaf");
    expect(ids).toContain("perfect-spark");
    expect(ids).toContain("table-6-spark");
  });

  it("keeps several animated stickers for rare or epic reveals", () => {
    const animated = STICKERS.filter((sticker) => sticker.animationId);

    expect(animated.length).toBeGreaterThanOrEqual(8);
    expect(animated.every((sticker) => sticker.rarity !== "common")).toBe(true);
  });
});

describe("sticker unlocks", () => {
  it("selects a session sticker that is not already owned", () => {
    const sessionStickers = STICKERS.filter(
      (sticker) => sticker.unlockKind === "session",
    );
    const owned = sessionStickers.slice(0, -1).map((sticker) => sticker.id);

    expect(selectNextSessionSticker(owned)?.id).toBe(sessionStickers.at(-1)?.id);
  });

  it("does not select duplicate session stickers while one remains available", () => {
    const sessionStickers = STICKERS.filter(
      (sticker) => sticker.unlockKind === "session",
    );
    const initial = resetAdventure();
    const rewards = {
      ...initial.rewards,
      stickersUnlocked: sessionStickers
        .slice(0, -1)
        .map((sticker) => sticker.id),
    };
    const finalized = finalizeSessionRewards(
      rewards,
      initial.progress,
      completedSession(),
    );

    expect(finalized.grant.stickerIds).toContain(sessionStickers.at(-1)?.id);
    expect(
      finalized.grant.stickerIds.some((stickerId) =>
        rewards.stickersUnlocked.includes(stickerId),
      ),
    ).toBe(false);
  });

  it("does not grant a duplicate session sticker when the session catalog is complete", () => {
    const initial = resetAdventure();
    const rewards = {
      ...initial.rewards,
      stickersUnlocked: STICKERS.filter(
        (sticker) => sticker.unlockKind === "session",
      ).map((sticker) => sticker.id),
    };
    const finalized = finalizeSessionRewards(
      rewards,
      initial.progress,
      completedSession(),
    );

    expect(finalized.grant.stickerIds).toEqual([]);
  });

  it("keeps stickers on results reset and clears them on adventure reset", () => {
    const state: AppState = {
      ...resetAdventure(),
      rewards: {
        ...resetAdventure().rewards,
        stickersUnlocked: ["forest-leaf", "space-rocket"],
      },
    };

    expect(resetResults(state).rewards.stickersUnlocked).toEqual([
      "forest-leaf",
      "space-rocket",
    ]);
    expect(resetAdventure().rewards.stickersUnlocked).toEqual([]);
  });
});

function completedSession(): SessionResult {
  return {
    total: 10,
    correctCount: 8,
    wrongOperations: [],
    fixedDifficultOperations: [],
  };
}
