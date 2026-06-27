---
name: edukotable-question-engine
description: Use when implementing or reviewing EdukoTable operation generation, table selection, answer choices, anti-repetition logic, random mode, training mode, or difficult mode.
---

# EdukoTable Question Engine

## Purpose

Implement and protect the multiplication question engine.

Use this skill for:

- `src/domain/operations.ts`
- `src/domain/tableSelection.ts`
- `src/domain/questionEngine.ts`
- tests related to question generation;
- bugs involving repeated operations;
- bugs involving repeated answer choices;
- training mode weighting.

## Required reading

Read before coding:

- `docs/03-domain-model.md`
- `docs/04-question-engine.md`
- `docs/07-testing-plan.md`

## Hard requirements

- Factors are 2..10.
- There are 81 ordered operations.
- `6x7` and `7x6` are separate operation keys.
- `6x7` and `7x6` share the same commutative `pairKey`.
- A selected table can appear on the left or right.
- Every question has exactly 4 unique choices.
- The correct answer appears exactly once.
- Do not use keyboard input.
- Do not generate impossible or absurd choices when plausible alternatives exist.

## Anti-repetition requirements

Avoid the bug where the child sees the same multiplication and same propositions repeatedly.

Implement and test:

- no same `operationKey` immediately if pool size > 1;
- avoid same `operationKey` in last 3 questions if possible;
- avoid same `pairKey` immediately if possible;
- no same `choicesFingerprint` immediately if alternatives exist;
- avoid same correct answer more than 2 times in a row if possible;
- avoid same correct answer index more than 2 times in a row if possible.

Use:

```ts
function getChoicesFingerprint(choices: number[]): string {
  return [...choices].sort((a, b) => a - b).join("|");
}
```

## Random mode

Random mode should be simple, varied, and fair.

Filtering order:

1. remove recent operation keys;
2. remove immediate commutative pair;
3. if no candidates remain, allow pair but still avoid exact last operation;
4. if still empty, fallback to full pool.

## Training mode

Training mode should favor:

- never attempted operations;
- operations with fewer than 3 attempts;
- operations with success rate < 60%;
- operations with success rate < 80%;
- operations failed recently.

Baseline weight function:

```ts
function getTrainingWeight(stats?: OperationStats): number {
  if (!stats || stats.attempts === 0) return 4;

  const rate = stats.correct / stats.attempts;
  let weight = 1;

  if (stats.attempts < 3) weight += 2;

  if (rate < 0.6) weight += 5;
  else if (rate < 0.8) weight += 3;
  else if (rate < 0.95) weight += 1;

  if (stats.lastResult === "wrong") weight += 2;

  return weight;
}
```

Still apply anti-repetition constraints after weighting.

## Answer choices

Generate plausible distractors from:

- neighboring tables;
- +/- factor errors;
- addition confusion;
- products from other tables.

Filter invalid candidates.

Ensure choices are varied:

- one near if possible;
- one medium if possible;
- one farther but plausible if possible.

Never return duplicates.

## Tests to add or update

For every engine change, add or update tests for:

- all operations count;
- selected table semantics;
- 4 unique choices;
- correct answer inclusion;
- no immediate repetition;
- no immediate fingerprint repetition;
- training weights.

## Do not

- Do not encode one-off hardcoded sessions.
- Do not use browser state inside domain functions.
- Do not hide random behavior in React components.
- Do not sacrifice correctness for animation or UX.
