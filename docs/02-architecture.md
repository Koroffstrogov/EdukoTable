# EdukoTable — architecture technique

## Stack recommandée

- React
- Vite
- TypeScript
- CSS modules ou CSS simple organisé
- Vitest pour les tests de domaine
- localStorage versionné pour le MVP

## Structure cible

```txt
src/
  app/
    App.tsx
    routes.tsx

  domain/
    operations.ts
    tableSelection.ts
    questionEngine.ts
    progress.ts
    rewards.ts
    sessions.ts

  storage/
    localStore.ts
    migrations.ts

  components/
    Layout.tsx
    HomeScreen.tsx
    TablePicker.tsx
    QuestionCard.tsx
    AnswerGrid.tsx
    FeedbackOverlay.tsx
    SessionSummary.tsx
    RewardBurst.tsx
    StickerAlbum.tsx
    ProgressDashboard.tsx
    ResetProgressPanel.tsx
    Mascot.tsx

  styles/
    theme.css
    animations.css

  test/
    fixtures.ts
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
  | "progress";
```

## Scripts attendus

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

Si ESLint n’est pas installé au départ, mettre en place une configuration minimale ou adapter le script.

## Dépendances

Limiter les dépendances.

Dépendances normales :

- `react`
- `react-dom`

Dépendances dev :

- `vite`
- `typescript`
- `vitest`
- `@vitejs/plugin-react`
- types React

Ne pas ajouter de bibliothèque lourde d’animation dans le MVP. Les animations CSS suffisent.

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
