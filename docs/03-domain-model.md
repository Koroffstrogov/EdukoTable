# EdukoTable — modèle de domaine

## Facteurs

```ts
export const FACTORS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type Factor = (typeof FACTORS)[number];
```

## Opération

Les opérations sont ordonnées.

```ts
export type Operation = {
  a: Factor;
  b: Factor;
  key: string;     // "6x7"
  pairKey: string; // "6x7" pour 6x7 et 7x6
};
```

Règles :

- `6×7` et `7×6` ont des stats distinctes.
- `pairKey` sert à détecter la paire commutative.
- Le produit est `a * b`.

## Construction des opérations

```ts
export function getOperationKey(a: number, b: number): string {
  return `${a}x${b}`;
}

export function getPairKey(a: number, b: number): string {
  return [a, b].sort((x, y) => x - y).join("x");
}

export function buildAllOperations(): Operation[] {
  const operations: Operation[] = [];

  for (const a of FACTORS) {
    for (const b of FACTORS) {
      operations.push({
        a,
        b,
        key: getOperationKey(a, b),
        pairKey: getPairKey(a, b),
      });
    }
  }

  return operations;
}
```

Il y a 81 opérations ordonnées de `2×2` à `10×10`.

## Sélection par table

```ts
export function operationBelongsToSelectedTables(
  operation: Operation,
  selectedTables: Factor[]
): boolean {
  return (
    selectedTables.includes(operation.a) ||
    selectedTables.includes(operation.b)
  );
}

export function buildOperationPool(selectedTables: Factor[]): Operation[] {
  return buildAllOperations().filter((operation) =>
    operationBelongsToSelectedTables(operation, selectedTables)
  );
}
```

## Stats par opération

```ts
export type OperationResult = "correct" | "wrong";

export type OperationStats = {
  attempts: number;
  correct: number;
  wrong: number;
  lastResult?: OperationResult;
  lastAnsweredAt?: string;
};
```

## État de progression

```ts
export type ProgressState = {
  version: number;
  operationStats: Record<string, OperationStats>;
};
```

## État des récompenses

```ts
export type RewardState = {
  stars: number;
  totalStarsEarned: number;
  stickersUnlocked: string[];
  badgesUnlocked: string[];
  sessionsCompleted: number;
  practiceDates: string[];
  lastPracticeDate?: string;
  dailyMissionCompletions: Record<string, string[]>;
};
```

## Réglages

```ts
export type SettingsState = {
  selectedTables: Factor[];
  soundEnabled: boolean;
  animationsEnabled: boolean;
};
```

## État racine

```ts
export type AppState = {
  version: number;
  progress: ProgressState;
  rewards: RewardState;
  settings: SettingsState;
};
```

## Mise à jour des stats

```ts
export function updateOperationStats(
  stats: OperationStats | undefined,
  wasCorrect: boolean,
  answeredAt = new Date().toISOString()
): OperationStats {
  const current = stats ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
  };

  return {
    attempts: current.attempts + 1,
    correct: current.correct + (wasCorrect ? 1 : 0),
    wrong: current.wrong + (wasCorrect ? 0 : 1),
    lastResult: wasCorrect ? "correct" : "wrong",
    lastAnsweredAt: answeredAt,
  };
}
```

## Taux de réussite

```ts
export function getSuccessRate(stats?: OperationStats): number | null {
  if (!stats || stats.attempts === 0) return null;
  return stats.correct / stats.attempts;
}
```

## Statut dérivé

```ts
export type OperationStatus =
  | "new"
  | "discovering"
  | "difficult"
  | "fragile"
  | "strong";

export function getOperationStatus(stats?: OperationStats): OperationStatus {
  if (!stats || stats.attempts === 0) return "new";
  if (stats.attempts < 3) return "discovering";

  const rate = stats.correct / stats.attempts;

  if (rate < 0.6) return "difficult";
  if (rate < 0.8) return "fragile";
  return "strong";
}
```

## Reset

### Reset résultats

Efface uniquement :

- `progress.operationStats`.

Conserve :

- étoiles ;
- stickers ;
- badges ;
- historique de récompenses ;
- réglages.

### Reset aventure

Réinitialise :

- progression ;
- récompenses ;
- réglages par défaut.

Doit demander une confirmation forte côté UI.
