# EdukoTable — système de récompenses

## Objectif

Le système de récompenses doit donner envie à l’enfant de revenir régulièrement, sans transformer l’application en machine à sessions infinies.

Il doit valoriser :

- l’effort ;
- la réussite ;
- la régularité ;
- les progrès techniques réels ;
- le fait de retravailler une difficulté.

## Types de récompenses

### 1. Étoiles

Monnaie simple et positive.

Sources :

```txt
Bonne réponse : +1
Session terminée : +3
Session parfaite : +5
Opération difficile réussie : +2
Badge technique débloqué : +5 à +20
```

Ne jamais retirer d’étoiles après une erreur.

### 2. Stickers

Récompense visuelle principale.

Règles actuelles :

- 1 sticker après chaque session terminée, si le stock de stickers non débloqués le permet ;
- aucun doublon de sticker de session tant qu’un sticker de session non possédé existe ;
- 1 sticker `perfect-spark` après la première session parfaite ;
- 1 sticker de table après maîtrise d’une table ;
- reset résultats conserve les stickers ;
- reset aventure efface les stickers.

Le catalogue est local, défini dans `src/domain/stickers.ts`.

Exemples de collections non genrées :

```txt
Forêt Eduko
Espace Eduko
Océan Eduko
Machines rigolotes
Créatures amies
```

Les stickers utilisent une rareté simple :

```ts
type StickerRarity = "common" | "rare" | "epic";
```

Quelques stickers rares ou épiques peuvent référencer une animation locale.
Chaque animation doit conserver un fallback statique.

### 3. Badges

Récompenses de jalons techniques.

Badges MVP :

```txt
first-session
first-perfect-session
table-2-mastered
table-3-mastered
table-4-mastered
table-5-mastered
table-6-mastered
table-7-mastered
table-8-mastered
table-9-mastered
table-10-mastered
ten-correct-answers
fifty-correct-answers
hundred-answers
comeback-day-3
difficult-operation-fixed
```

### 4. Mascotte

La mascotte ne doit pas nécessiter une mécanique complexe en MVP.

États suffisants :

```ts
type MascotMood = "idle" | "thinking" | "happy" | "encouraging" | "celebrating";
```

La mascotte réagit :

- bonne réponse : happy ;
- erreur : encouraging ;
- fin de session : celebrating ;
- attente : thinking ou idle.

## Récompense immédiate

Après bonne réponse :

```txt
+1 étoile
animation étoile vers compteur
mascotte contente
```

Après erreur :

```txt
pas de perte
message encourageant
opération ajoutée naturellement aux stats
```

## Récompense de session

```ts
type SessionResult = {
  total: number;
  correctCount: number;
  wrongOperations: Operation[];
  fixedDifficultOperations: Operation[];
};
```

Calcul proposé :

```ts
export function computeSessionReward(result: SessionResult): RewardGrant {
  const starsForCorrectAnswers = result.correctCount;
  const completionBonus = 3;
  const perfectBonus = result.correctCount === result.total ? 5 : 0;
  const fixedDifficultyBonus = result.fixedDifficultOperations.length * 2;

  return {
    stars:
      starsForCorrectAnswers +
      completionBonus +
      perfectBonus +
      fixedDifficultyBonus,
    stickerIds: [],
    badgeIds: [],
  };
}
```

Les stickers et badges sont ajoutés par une fonction de jalons :

```ts
evaluateRewardMilestones(previousState, nextState, sessionResult)
```

## Missions du jour

Option MVP+.

Exemples :

```txt
Faire une session de 10 questions
Réussir 7 bonnes réponses
Réussir une opération difficile
```

Recommandation :

- maximum 3 missions du jour ;
- bonus fort uniquement sur les premières missions ;
- pas de punition en cas d’absence.

Éviter :

```txt
Tu as perdu ta série.
```

Préférer :

```txt
Tu as révisé 4 jours différents.
```

## Maîtrise d’une opération

```ts
export function isOperationMastered(stats?: OperationStats): boolean {
  if (!stats || stats.attempts < 3) return false;
  return stats.correct / stats.attempts >= 0.8;
}
```

## Maîtrise d’une table

Une table est maîtrisée si toutes les opérations de cette table, côté gauche ou droit, sont maîtrisées dans le périmètre 2..10.

```ts
export function getOperationsForTable(table: Factor): Operation[] {
  return buildAllOperations().filter(
    (op) => op.a === table || op.b === table
  );
}

export function isTableMastered(
  table: Factor,
  statsByKey: Record<string, OperationStats>
): boolean {
  return getOperationsForTable(table).every((op) =>
    isOperationMastered(statsByKey[op.key])
  );
}
```

## Opération difficile corrigée

Une opération est considérée comme “corrigée” si :

- elle était `difficult` ou `fragile` avant la réponse ;
- la nouvelle réponse est correcte ;
- son nouveau taux atteint au moins 80 % avec au moins 3 tentatives.

Récompense :

```txt
+2 étoiles
badge difficult-operation-fixed si première fois
message : "Tu as transformé une difficulté en réussite."
```

## Reset des résultats

Action : `resetResults`

Efface :

- stats par opération.

Conserve :

- étoiles ;
- stickers ;
- badges ;
- sessions complétées ;
- dates de pratique ;
- réglages.

Texte UI :

```txt
Réinitialiser les résultats ?
Tes pourcentages et erreurs seront effacés.
Tu gardes tes étoiles, stickers et badges.
```

## Reset de l’aventure

Action : `resetAdventure`

Efface tout.

Texte UI :

```txt
Recommencer toute l’aventure ?
Les résultats, étoiles, stickers et badges seront effacés.
```

Exiger confirmation forte :

- bouton secondaire d’abord ;
- puis appui long ou saisie simple non clavier évitée si possible ;
- au minimum, double confirmation.
