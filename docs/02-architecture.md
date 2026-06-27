# EdukoTable — architecture technique

## Stack recommandée

- React
- Vite
- TypeScript
- CSS simple organisé
- Vitest pour les tests de domaine
- Playwright pour quelques parcours mobiles critiques
- localStorage versionné pour le MVP

## Structure cible

```txt
src/
  app/
    App.tsx

  assets/
    animations/
      registry.ts
      *.json

  domain/
    animations.ts
    operations.ts
    progress.ts
    tableSelection.ts
    questionEngine.ts
    rewards.ts
    stickers.ts
    types.ts

  storage/
    localStore.ts
    migrations.ts

  components/
    HomeScreen.tsx
    TablePicker.tsx
    QuestionCard.tsx
    AnswerGrid.tsx
    FeedbackOverlay.tsx
    SessionSummary.tsx
    RewardBurst.tsx
    EdukoAnimation.tsx
    ConfirmDialog.tsx
    SettingsScreen.tsx
    StickerAlbum.tsx
    StickerVisual.tsx
    ProgressDashboard.tsx
    ResetProgressPanel.tsx
    Mascot.tsx

  styles/
    theme.css
    animations.css
```

## Séparation des responsabilités

### Domaine

Les fichiers `src/domain/*` doivent contenir des fonctions pures :

- construire les opérations ;
- filtrer les opérations ;
- générer les questions ;
- générer les choix ;
- mettre à jour les stats ;
- calculer les récompenses ;
- calculer les badges.

Ces fonctions doivent être testables sans React.

### Composants React

Les composants affichent l’état, déclenchent des actions, mais ne contiennent pas la logique métier complexe.

### Stockage

Le stockage local charge et sauvegarde `AppState`.

La structure doit être versionnée pour permettre des migrations :

```ts
const STORAGE_KEY = "edukotable:v1";
```

### Routing

Le MVP peut utiliser un état interne simple au lieu de React Router.

Exemple :

```ts
type Screen =
  | "home"
  | "table-picker"
  | "session"
  | "summary"
  | "album"
  | "progress"
  | "settings";
```

## Scripts attendus

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "test:watch": "vitest",
    "lint": "eslint .",
    "validate": "npm run lint && npm run test && npm run build && npm run test:e2e"
  }
}
```

Si ESLint n’est pas installé au départ, mettre en place une configuration minimale ou adapter le script.

## Dépendances

Limiter les dépendances.

Dépendances normales :

- `react`
- `react-dom`
- `lottie-react`

Dépendances dev :

- `vite`
- `typescript`
- `vitest`
- `@playwright/test`
- `@vitejs/plugin-react`
- types React

Ne pas ajouter de bibliothèque lourde supplémentaire. Les animations actuelles
restent locales, courtes, désactivables, avec fallback statique.

## Gestion d’état

Pour le MVP, `useReducer` est suffisant.

Exemple :

```ts
type AppAction =
  | { type: "startSession"; config: SessionConfig }
  | { type: "answerQuestion"; answer: number }
  | { type: "finishSession" }
  | { type: "unlockRewards"; rewards: RewardGrant }
  | { type: "resetResults" }
  | { type: "resetAdventure" };
```

Ne pas introduire Redux/Zustand sauf besoin réel.

## Performance

- L’app doit être instantanée.
- Les calculs sont petits : 81 opérations ordonnées.
- Éviter de recalculer inutilement les choix pendant un feedback.
- Précharger les assets légers de récompense si des images sont ajoutées.
