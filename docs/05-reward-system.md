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

### 3. Cartes Défi 6 choix

Le mode « Défi 6 choix » possède une mini-collection dédiée : **La Bande des Six**.
Elle contient six cartes stables, stockées localement et visibles dans l’album.

Règles :

- une carte de jalon remplace le sticker de session quand elle est débloquée ;
- les cartes sont révélées dans l’ordre, une à la fois ;
- aucun paquet aléatoire, aucun doublon et aucune carte perdue après une erreur ;
- les objectifs sont visibles dans l’album avant le déblocage ;
- une carte ne donne pas de pouvoir de jeu : son rôle est de rendre le progrès
  concret et de donner envie de revenir.

Collection :

```txt
Hexa la Luciole      → 1 défi terminé
Tempo la Tortue      → 2 défis terminés
Prismo le Caméléon   → 20 bonnes réponses en mode 6 choix
Boulon le Robot      → 5 défis terminés
Manta-Mémo           → 40 bonnes réponses en mode 6 choix
Nova Six             → un 10/10 ou 10 défis terminés
```

Le suivi minimal persiste :

```ts
type ChallengeSixProgress = {
  sessionsCompleted: number;
  correctAnswers: number;
  perfectSessions: number;
};
```

Une remise à zéro des résultats conserve les cartes et leur progression. Une
remise à zéro de l’aventure les efface.

### 4. Badges

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

### 5. Mascotte

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

L’étoile est enregistrée avec les statistiques dès la réponse, même si la page
est rechargée avant la fin de la mission. La finalisation ajoute uniquement les
bonus restants ; le résumé continue d’afficher le total des gains de la session.
L’abandon conserve les étoiles déjà gagnées sans les créditer une seconde fois.
Le dialogue de sortie suspend le feedback. Si les dix réponses sont déjà données,
confirmer la sortie termine la mission avec ses récompenses de fin.

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

## Les Fabuleuses — 36 cartes en neuf familles

Le compagnon choisi dans l'album progresse à chaque mission de 10 questions
terminée, en 4 ou 6 choix, quel que soit le score. Ses cartes se gagnent après
1, 2, 4 et 7 missions. Les missions abandonnées gardent leurs étoiles immédiates
mais n'avancent pas cette collection.

Ronronova, Lunabelle, Pralinette, Pétalipop, Pomponnette, Coralie Glouglou,
Flûtinelle, Ninachou et Baskétoile ont chacune quatre illustrations distinctes.
Changer de compagnon préserve les cartes et les compteurs des autres familles.
Une évolution ne consomme jamais la carte précédente. Les raretés sont :
Choupinette, Pailletée, Étincelante, Féerique, Royalissime, Mythique,
Galactastique et WOUAH ULTIME ! Toutes sont accessibles par la persévérance.

Ces cartes s'ajoutent aux récompenses existantes. Aucun tirage au sort, achat,
compte ou défi parfait obligatoire. Le reset des résultats les conserve ; le
reset de l'aventure les efface. Le projet de 100 cartes est détaillé dans
`docs/09-fabuleuses.md` ; seules les 36 illustrations terminées sont proposées.
