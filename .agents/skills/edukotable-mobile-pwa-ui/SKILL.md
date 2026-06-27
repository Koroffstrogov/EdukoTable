---
name: edukotable-mobile-pwa-ui
description: Use when implementing or reviewing EdukoTable React screens, mobile UX, CSS, animations, accessibility, PWA metadata, and Vercel readiness.
---

# EdukoTable Mobile PWA UI

## Purpose

Build a child-friendly mobile-first interface for EdukoTable.

Use this skill for:

- React screens;
- components;
- CSS;
- animations;
- responsive behavior;
- PWA manifest;
- mobile usability;
- Vercel build.

## Required reading

Read before coding:

- `docs/06-ui-ux.md`
- `docs/08-pwa-vercel.md`
- `docs/01-mvp-spec.md`

## UI principles

- Mobile-first.
- Child-friendly.
- Non-gendered visual direction.
- Big touch targets.
- No keyboard input during questions.
- Short animations.
- Clear feedback.
- No aggressive error states.

## Required MVP screens

- Home.
- Table picker.
- Question session.
- Session summary with rewards.
- Album.
- Progress/settings.

## Component expectations

Use simple components:

- `HomeScreen`
- `TablePicker`
- `QuestionCard`
- `AnswerGrid`
- `FeedbackOverlay`
- `SessionSummary`
- `RewardBurst`
- `StickerAlbum`
- `ProgressDashboard`
- `ResetProgressPanel`
- `Mascot`

## Table picker rules

Avoid sliders.

Use:

- table buttons 2..10;
- quick groups: 2 à 5, 2 à 6, 2 à 10;
- custom multi-select buttons.

Always show what is selected.

## Answer grid

- 2x2 grid on mobile.
- Large buttons.
- Disabled state during feedback.
- Correct/incorrect visual feedback.
- Do not rely only on color.

## Animations

Allowed MVP animations:

- correct pop;
- light shake on wrong answer;
- star fly or simple pulse;
- sticker reveal;
- small confetti on session completion.

Respect:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Also respect app setting `animationsEnabled`.

## PWA

Ensure:

- title is EdukoTable;
- manifest exists;
- viewport meta exists;
- mobile status bar metadata exists;
- Vite build works;
- Vercel can serve `dist`.

## Accessibility

- Buttons at least 44px high.
- Sufficient contrast.
- `aria-live` for feedback.
- Semantic buttons.
- Visible focus states.
- Text alternatives for mascot/stickers if represented by images.

## Do not

- Do not add long blocking animations.
- Do not require drag/drop for MVP.
- Do not create desktop-first layouts.
- Do not bury the start button.
- Do not make the parent dashboard the main experience.
