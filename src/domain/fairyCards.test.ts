import { describe, expect, it } from "vitest";
import { advanceFairyCollection, createInitialFairyCollection, FAIRY_CARDS, FAIRY_FAMILIES, FAIRY_RARITIES, getFairyProgress } from "./fairyCards";
import { createInitialAppState, resetAdventure, resetResults } from "./progress";
import { finalizeAbandonedSessionRewards, finalizeSessionRewards } from "./rewards";
import { migrateAppState } from "../storage/migrations";
import type { SessionResult } from "./types";

const completed: SessionResult = { total: 10, correctCount: 0, wrongOperations: [], fixedDifficultOperations: [] };

describe("Les Fabuleuses", () => {
  it("offers thirty-six distinct artworks in nine complete evolution families and eight rarities", () => {
    expect(FAIRY_FAMILIES).toHaveLength(9);
    expect(FAIRY_CARDS).toHaveLength(36);
    for (const field of ["id", "number", "artwork"] as const) {
      expect(new Set(FAIRY_CARDS.map((card) => card[field])).size).toBe(36);
    }
    expect(new Set(FAIRY_CARDS.map((card) => card.rarity))).toEqual(new Set(FAIRY_RARITIES.map((rarity) => rarity.id)));
    for (const family of FAIRY_FAMILIES) {
      const cards = FAIRY_CARDS.filter((card) => card.familyId === family.id);
      expect(cards.map((card) => card.stage)).toEqual([1, 2, 3, 4]);
      expect(cards.map((card) => card.requiredSessions)).toEqual([1, 2, 4, 7]);
    }
  });

  it("unlocks exactly at milestones, preserving progress while switching companions", () => {
    let collection = createInitialFairyCollection();
    const initial = structuredClone(collection);
    for (let mission = 1; mission <= 7; mission += 1) {
      for (const family of FAIRY_FAMILIES) {
        collection = { ...collection, selectedFamilyId: family.id };
        const next = advanceFairyCollection(collection);
        const expectedStage = new Map([[1, 1], [2, 2], [4, 3], [7, 4]]).get(mission);
        expect(next.cardIds).toEqual(expectedStage ? [`${family.id}-${expectedStage}`] : []);
        expect(collection.sessionsByFamily[family.id]).toBe(mission - 1);
        collection = next.collection;
      }
    }
    expect(collection.unlockedCardIds).toHaveLength(36);
    expect(getFairyProgress(collection).nextCard).toBeUndefined();
    expect(advanceFairyCollection(collection)).toEqual({ collection, cardIds: [] });
    expect(initial.unlockedCardIds).toEqual([]);
  });

  it.each([4, 6] as const)("rewards effort in %i-choice missions without changing existing collections", (choiceCount) => {
    const state = createInitialAppState();
    state.rewards.stickersUnlocked = ["forest-leaf"];
    state.rewards.challengeCardsUnlocked = ["hexa-firefly"];
    const next = finalizeSessionRewards(state.rewards, state.progress, completed, undefined, { choiceCount });
    expect(next.grant.fairyCardIds).toEqual(["ronronova-1"]);
    expect(next.rewards.fairyCollection.sessionsByFamily.ronronova).toBe(1);
    expect(next.rewards.stickersUnlocked).toContain("forest-leaf");
    expect(next.rewards.challengeCardsUnlocked).toContain("hexa-firefly");
    expect(next.rewards.stars).toBeGreaterThanOrEqual(3);
  });

  it("does not evolve for answer rewards, unfinished missions or abandonment", () => {
    const state = createInitialAppState();
    const result = { ...completed, total: 9, correctCount: 4 };
    const abandoned = finalizeAbandonedSessionRewards(state.rewards, result);
    expect(abandoned.rewards.fairyCollection).toEqual(state.rewards.fairyCollection);
    expect(abandoned.grant.fairyCardIds).toEqual([]);
    expect(finalizeSessionRewards(state.rewards, state.progress, result).grant.fairyCardIds).toEqual([]);
  });

  it("upgrades version 2 without losing stars, legacy collections or saved settings", () => {
    const original = createInitialAppState();
    original.rewards.stars = 100;
    original.rewards.stickersUnlocked = ["forest-leaf", "perfect-spark"];
    original.rewards.challengeCardsUnlocked = ["hexa-firefly"];
    original.rewards.sessionsCompleted = 42;
    original.settings.animationsEnabled = false;
    const migrated = migrateAppState({ ...original, version: 2, rewards: { ...original.rewards, fairyCollection: undefined } });
    expect(migrated.version).toBe(3);
    expect(migrated.rewards).toEqual(original.rewards);
    expect(migrated.settings).toEqual(original.settings);
  });

  it("sanitizes malformed data while preserving earned evolutions", () => {
    const migrated = migrateAppState({ rewards: { fairyCollection: {
      selectedFamilyId: "unknown",
      sessionsByFamily: { ronronova: -10, lunabelle: 2.9, pralinette: Infinity },
      unlockedCardIds: ["ronronova-3", "ronronova-3", "unknown", 12],
    } } }).rewards.fairyCollection;
    expect(migrated.selectedFamilyId).toBe("ronronova");
    expect(migrated.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, ronronova: 4, lunabelle: 2 });
    expect(migrated.unlockedCardIds).toEqual(["ronronova-1", "ronronova-2", "ronronova-3", "lunabelle-1", "lunabelle-2"]);
  });

  it("round trips new rewards, resets only results, and clears everything on adventure reset", () => {
    const state = createInitialAppState();
    state.rewards.fairyCollection.selectedFamilyId = "pralinette";
    state.rewards = finalizeSessionRewards(state.rewards, state.progress, completed).rewards;
    const reloaded = migrateAppState(JSON.parse(JSON.stringify(state)));
    expect(reloaded).toEqual(state);
    expect(resetResults(reloaded).rewards).toEqual(state.rewards);
    expect(resetAdventure().rewards.fairyCollection).toEqual(createInitialFairyCollection());
  });

  it("adds new family counters to an existing v3 album without changing its companion or rewards", () => {
    const previous = {
      ...createInitialAppState(),
      rewards: {
        ...createInitialAppState().rewards,
        stars: 93,
        fairyCollection: {
          selectedFamilyId: "lunabelle",
          sessionsByFamily: { ronronova: 4, lunabelle: 2, pralinette: 0 },
          unlockedCardIds: ["ronronova-1", "ronronova-2", "ronronova-3", "lunabelle-1", "lunabelle-2"],
        },
      },
    };
    const migrated = migrateAppState(previous);
    expect(migrated.rewards.stars).toBe(93);
    expect(migrated.rewards.fairyCollection).toEqual({
      ...previous.rewards.fairyCollection,
      sessionsByFamily: { ...createInitialFairyCollection().sessionsByFamily, ...previous.rewards.fairyCollection.sessionsByFamily },
    });
  });

  it("extends a six-family v3 album while preserving its completed and partial companions", () => {
    const state = createInitialAppState();
    const previousCollection = {
      selectedFamilyId: "coralie",
      sessionsByFamily: { ronronova: 0, lunabelle: 0, pralinette: 0, petalipop: 2, pomponnette: 0, coralie: 7 },
      unlockedCardIds: ["petalipop-1", "petalipop-2", "coralie-1", "coralie-2", "coralie-3", "coralie-4"],
    };
    const loaded = migrateAppState({ ...state, rewards: { ...state.rewards, fairyCollection: previousCollection } });
    expect(loaded.rewards.fairyCollection).toEqual({
      ...previousCollection,
      sessionsByFamily: { ...previousCollection.sessionsByFamily, flutinelle: 0, ninachou: 0, basketoile: 0 },
    });
    expect(resetResults(loaded).rewards).toEqual(loaded.rewards);
  });

  it.each(["petalipop", "pomponnette", "coralie", "flutinelle", "ninachou", "basketoile"] as const)("earns and reloads all %s evolutions without consuming earlier cards", (familyId) => {
    const state = createInitialAppState();
    state.rewards.fairyCollection.selectedFamilyId = familyId;
    for (let mission = 0; mission < 7; mission += 1) {
      state.rewards = finalizeSessionRewards(state.rewards, state.progress, completed).rewards;
    }
    const expectedIds = [1, 2, 3, 4].map((stage) => `${familyId}-${stage}`);
    const loaded = migrateAppState(JSON.parse(JSON.stringify(state)));
    expect(loaded.rewards.fairyCollection.unlockedCardIds).toEqual(expectedIds);
    expect(loaded.rewards.fairyCollection.selectedFamilyId).toBe(familyId);
    expect(loaded.rewards.fairyCollection.sessionsByFamily[familyId]).toBe(7);
    expect(loaded.rewards.fairyCollection.sessionsByFamily.ronronova).toBe(0);
  });
});
