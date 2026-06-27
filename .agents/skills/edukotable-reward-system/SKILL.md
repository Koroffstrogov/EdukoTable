---
name: edukotable-reward-system
description: Use when implementing or reviewing EdukoTable rewards, stars, stickers, badges, mascot reactions, milestones, daily missions, or reset behavior.
---

# EdukoTable Reward System

## Purpose

Make rewards central, simple, and motivating.

Use this skill for:

- `src/domain/rewards.ts`
- reward UI components;
- sticker album;
- badges;
- mascot reactions;
- daily mission logic;
- reset logic.

## Required reading

Read before coding:

- `docs/05-reward-system.md`
- `docs/01-mvp-spec.md`
- `docs/06-ui-ux.md`
- `docs/07-testing-plan.md`

## Reward principles

- Reward effort and progress.
- Never punish mistakes by removing earned rewards.
- Avoid anxiety mechanics.
- Avoid streak loss.
- Keep rewards understandable to a child.
- Keep reward logic deterministic and testable.
- Do not make rewards require long sessions.

## MVP reward types

Implement at least:

- stars;
- stickers;
- badges;
- mascot mood.

## Stars

Recommended rules:

```txt
Correct answer: +1
Session completed: +3
Perfect session: +5
Difficult operation fixed: +2
Milestone badge: +5 to +20
```

## Stickers

MVP rules:

- unlock a sticker after a completed session when one is available;
- unlock special sticker for first perfect session;
- unlock special sticker for mastered tables.

Use stable IDs.

Example:

```ts
type Sticker = {
  id: string;
  collectionId: string;
  label: string;
  emoji?: string;
  rarity: "common" | "special";
};
```

## Badges

Use stable IDs.

Core badges:

- `first-session`
- `first-perfect-session`
- `table-2-mastered`
- ...
- `table-10-mastered`
- `hundred-answers`
- `difficult-operation-fixed`

Unlock each badge only once.

## Mascot

Keep MVP mascot logic simple.

```ts
type MascotMood =
  | "idle"
  | "thinking"
  | "happy"
  | "encouraging"
  | "celebrating";
```

## Reset behavior

Implement two distinct operations.

### Reset results

Clears:

- operation stats.

Keeps:

- stars;
- stickers;
- badges;
- sessions completed;
- practice dates;
- settings.

### Reset adventure

Clears:

- operation stats;
- rewards;
- settings to defaults.

Requires strong UI confirmation.

## Tests

Add or update tests for:

- session reward calculation;
- perfect bonus;
- sticker unlock;
- one-time badge unlock;
- operation mastered;
- table mastered;
- reset results preserves rewards;
- reset adventure clears rewards.

## Do not

- Do not subtract stars for mistakes.
- Do not lock progress behind a paywall or account.
- Do not add a complex shop in MVP.
- Do not add punitive streaks.
