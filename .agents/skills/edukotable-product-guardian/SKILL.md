---
name: edukotable-product-guardian
description: Use for EdukoTable product decisions, scope control, UX tradeoffs, MVP planning, feature prioritization, and preventing over-complexity.
---

# EdukoTable Product Guardian

## Purpose

Keep EdukoTable aligned with the MVP and product intent.

Use this skill when:

- planning a feature;
- changing UX flows;
- deciding if a feature belongs in MVP;
- adding settings, modes, rewards, or statistics;
- writing summaries for the user.

## Required reading

Before making product decisions, read:

- `docs/00-product-brief.md`
- `docs/01-mvp-spec.md`
- `docs/06-ui-ux.md`

If the task touches rewards, also read:

- `docs/05-reward-system.md`

If the task touches question generation, also read:

- `docs/04-question-engine.md`

## Product rules

Maintain these constraints:

- App name is EdukoTable.
- Child-first interface.
- Mobile-first PWA.
- Tables 2 to 10.
- Four choices per question.
- No keyboard input.
- Sessions are short, 10 questions by default.
- Rewards are core to the MVP.
- Tracking must remain simple.
- Do not expose complex stats to children.
- Do not create punitive mechanics.
- Do not add leaderboards, lives, forced timers, or long sessions.

## Decision heuristic

When evaluating a feature, classify it:

```txt
MVP core      → required now
MVP support   → useful only if simple
Post-MVP      → document but do not implement now
Rejected      → conflicts with product principles
```

## MVP core

- Table selection.
- Random mission.
- Training mode.
- Four answer choices.
- Immediate feedback.
- Operation stats.
- Rewards: stars, stickers, badges, mascot reactions.
- Reset results.
- Reset adventure.

## Post-MVP examples

- Multiple child profiles.
- Cloud sync.
- Rich avatar customization.
- Seasonal collections.
- Advanced parent analytics.
- Full offline service worker.
- Sound design pack.
- Timed challenge mode.

## Rejection examples

- Public leaderboard.
- Punitive streak loss.
- Removing rewards from children after mistakes.
- Required keyboard input.
- Long default sessions.
- Complex adult-style dashboards as the main screen.

## Output style

When making a product recommendation, include:

1. recommended decision;
2. rationale;
3. implementation impact;
4. whether it is MVP or post-MVP.
