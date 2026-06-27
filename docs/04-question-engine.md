# EdukoTable — moteur de questions

## Objectif

Le moteur doit générer des questions variées, fiables et adaptées au mode choisi.

Il doit éviter un problème observé dans la version précédente : tomber sur une répétition d’affilée des mêmes multiplications avec les mêmes propositions.

## Concepts

```ts
type SessionMode = "random" | "training" | "difficult";

type SessionConfig = {
  mode: SessionMode;
  selectedTables: Factor[];
  questionCount: number; // 10 par défaut
};

type Question = {
  operation: Operation;
  choices: number[];
  correctAnswer: number;
};

type QuestionHistoryItem = {
  operationKey: string;
  pairKey: string;
  correctAnswer: number;
  choicesFingerprint: string;
  correctChoiceIndex: number;
};
```

## Pool d’opérations

Le pool dépend des tables sélectionnées.

```ts
buildOperationPool(selectedTables)
```

Rappel :

```txt
selectedTables = [6]
inclut 6×2, 2×6, 6×3, 3×6, ..., 6×10, 10×6
exclut 7×8
```

## Règles anti-répétition

À appliquer quand le pool est assez grand.

### Règles strictes

- Ne jamais poser exactement la même opération deux fois de suite.
- Ne jamais réutiliser exactement les mêmes 4 propositions deux fois de suite.
- Les 4 propositions doivent être uniques.
- La bonne réponse doit être présente exactement une fois.

### Règles préférentielles

À respecter si le pool le permet :

- éviter la même opération dans les 3 dernières questions ;
- éviter la paire commutative immédiatement après ;
  - exemple : éviter `7×6` juste après `6×7`;
- éviter le même résultat correct plus de 2 fois d’affilée ;
- éviter la même position de bonne réponse plus de 2 fois d’affilée ;
- éviter une séquence trop monotone de mêmes facteurs.

## Fingerprint des propositions

Utiliser un fingerprint indépendant de l’ordre pour détecter les mêmes ensembles :

```ts
export function getChoicesFingerprint(choices: number[]): string {
  return [...choices].sort((a, b) => a - b).join("|");
}
```

Exemple :

```txt
[36, 42, 48, 49] → "36|42|48|49"
[42, 49, 36, 48] → "36|42|48|49"
```

Ces deux questions ont le même ensemble de propositions, même si l’ordre change.

## Choix de l’opération en mode aléatoire

```ts
export function pickRandomOperation(
  pool: Operation[],
  history: QuestionHistoryItem[]
): Operation {
  const recentKeys = new Set(history.slice(-3).map((item) => item.operationKey));
  const last = history.at(-1);

  const preferred = pool.filter((op) => {
    if (recentKeys.has(op.key)) return false;
    if (last && op.pairKey === last.pairKey) return false;
    return true;
  });

  if (preferred.length > 0) {
    return randomItem(preferred);
  }

  const notSameAsLast = pool.filter((op) => op.key !== last?.operationKey);
  return randomItem(notSameAsLast.length > 0 ? notSameAsLast : pool);
}
```

## Choix de l’opération en mode entraînement

Le mode entraînement utilise des poids.

```ts
export function getTrainingWeight(stats?: OperationStats): number {
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

Appliquer ensuite les mêmes règles anti-répétition que le mode aléatoire. Si le filtrage retire tout le pool, revenir à un filtrage plus souple.

## Mode difficile

Filtrer les opérations avec :

```txt
attempts >= 3
successRate < 0.8
```

S’il y en a moins de 4 ou si le pool est trop petit, compléter avec le mode entraînement.

## Génération des 4 propositions

Pour une opération `a × b`, la réponse correcte est `a * b`.

Les mauvaises réponses doivent être plausibles et variées.

### Sources de distracteurs

1. Tables voisines :

```ts
a * (b - 1)
a * (b + 1)
(a - 1) * b
(a + 1) * b
```

2. Erreurs proches :

```ts
correct - a
correct + a
correct - b
correct + b
```

3. Confusion addition / multiplication :

```ts
a + b
```

4. Produits crédibles d’autres tables :

```ts
x * y pour x,y dans 2..10
```

### Filtrage

Supprimer :

- la réponse correcte ;
- les valeurs ≤ 0 ;
- les valeurs > 100 ;
- les doublons ;
- les valeurs non entières.

### Variété

Choisir 3 mauvaises réponses avec au moins :

- une proche ;
- une moyenne ;
- une plus éloignée, si possible.

Catégories proposées :

```ts
near: distance <= 10
medium: distance > 10 && distance <= 25
far: distance > 25
```

Si un bucket est vide, compléter avec les meilleurs candidats restants.

## Placement de la bonne réponse

L’ordre des 4 propositions doit être mélangé.

Éviter que la bonne réponse apparaisse dans la même position plus de 2 fois d’affilée.

Approche simple :

1. générer les 4 valeurs ;
2. mélanger ;
3. si la position correcte répète les deux dernières positions, remélanger jusqu’à 10 fois ;
4. accepter le dernier tirage si aucune alternative n’est trouvée.

## Re-génération en cas de répétition

Lors de la création d’une question :

1. choisir une opération ;
2. générer les propositions ;
3. calculer le fingerprint ;
4. vérifier contre les 2 derniers fingerprints ;
5. si répétition, régénérer les propositions jusqu’à 20 fois ;
6. si toujours répétition, choisir une autre opération ;
7. accepter un fallback seulement si le pool est trop petit.

## Critères de test

Tests obligatoires :

- `buildAllOperations` retourne 81 opérations.
- `buildOperationPool([6])` inclut `6x7` et `7x6`.
- `buildOperationPool([6])` exclut `7x8`.
- `generateChoices(a,b)` retourne 4 valeurs uniques.
- `generateChoices(a,b)` contient `a*b`.
- `generateChoices(a,b)` ne contient pas de valeur ≤ 0.
- deux questions consécutives ne peuvent pas avoir le même `operationKey` si le pool > 1.
- deux questions consécutives ne peuvent pas avoir le même `choicesFingerprint` si des alternatives existent.
- mode entraînement donne un poids supérieur aux opérations ratées récemment.
