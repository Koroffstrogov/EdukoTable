---
name: edukotable-quality-review
description: Use before finishing EdukoTable work to review scope, run checks, validate tests, inspect repetition safeguards, and summarize remaining issues.
---

# EdukoTable Quality Review

## Purpose

Use this skill before declaring an EdukoTable task complete.

## Required reading

Read as needed:

- `AGENTS.md`
- `docs/01-mvp-spec.md`
- `docs/04-question-engine.md`
- `docs/05-reward-system.md`
- `docs/07-testing-plan.md`

## Review checklist

### Product

- App is called EdukoTable.
- MVP scope is respected.
- No unnecessary complexity was added.
- Rewards are present, not postponed.
- Table selection is child-friendly.
- No keyboard input is required.

### Question engine

Verify:

- tables 2..10;
- ordered operation stats;
- selected table can be left or right;
- four unique choices;
- correct answer included;
- no same operation immediately when avoidable;
- no same choices fingerprint immediately when avoidable;
- training mode weights difficulties.

### Rewards

Verify:

- stars;
- stickers;
- badges;
- mascot reactions;
- no penalty for mistakes;
- reset results preserves rewards;
- reset adventure clears all with confirmation.

### UI

Verify:

- mobile layout works;
- buttons are large;
- animations are short;
- feedback is clear;
- error state is encouraging;
- album exists;
- progression/settings exist.

### Tests

Run:

```bash
npm run test
npm run build
npm run lint
```

If a command does not exist, add it if reasonable. Otherwise explain.

### Code quality

Check:

- TypeScript strictness;
- domain logic not buried in React components;
- localStorage state versioning;
- no heavy unnecessary dependencies;
- no dead files;
- no obvious console noise.

## Final response format

When finishing, summarize:

1. what changed;
2. tests/build commands run and results;
3. files touched;
4. any known limitations;
5. next recommended lot.
