# EdukoTable — plan de tests

## Objectif

Les tests doivent sécuriser surtout la logique de domaine. L’interface peut rester testée plus légèrement dans le MVP.

## Tests unitaires prioritaires

### Opérations

- `buildAllOperations()` retourne 81 opérations.
- Toutes les clés sont uniques.
- `6x7` et `7x6` existent.
- `6x7` et `7x6` ont la même `pairKey`.
- `6x7` et `7x6` ont des `key` différentes.

### Sélection de tables

- `buildOperationPool([6])` inclut `6x7`.
- `buildOperationPool([6])` inclut `7x6`.
- `buildOperationPool([6])` exclut `7x8`.
- `buildOperationPool([2,3])` inclut `2x10`, `10x3`, `3x8`.
- `buildOperationPool([2,3])` exclut `8x9`.

### Choix de réponses

Pour tous `a,b` dans 2..10 :

- retourne 4 propositions ;
- contient `a*b` ;
- ne contient pas de doublon ;
- ne contient pas de nombre ≤ 0 ;
- ne contient pas de nombre > 100 ;
- ne contient pas `NaN`.

### Anti-répétition

Simuler une session de 10 questions et vérifier :

- pas de même `operationKey` consécutif si pool > 1 ;
- pas de même `choicesFingerprint` consécutif si alternatives disponibles ;
- pas de même position correcte plus de 2 fois d’affilée si alternatives disponibles ;
- pas de même bonne réponse plus de 2 fois d’affilée si alternatives disponibles.

### Stats

- première bonne réponse crée `attempts=1`, `correct=1`, `wrong=0`.
- première erreur crée `attempts=1`, `correct=0`, `wrong=1`.
- les réponses suivantes incrémentent correctement.
- `lastResult` est mis à jour.
- `lastAnsweredAt` existe.

### Taux

- stats absentes → `null`.
- 0 tentative → `null`.
- 3 bonnes / 4 tentatives → `0.75`.

### Statut opération

- absent → `new`.
- attempts < 3 → `discovering`.
- rate < 0.6 → `difficult`.
- rate < 0.8 → `fragile`.
- rate ≥ 0.8 → `strong`.

### Entraînement

- une opération jamais tentée a un poids supérieur à une opération forte.
- une opération ratée récemment a un bonus.
- une opération avec taux < 0.6 a un poids supérieur à taux 0.75.
- le filtrage anti-répétition reste appliqué.

### Récompenses

- bonne réponse ajoute une étoile.
- session terminée ajoute bonus de complétion.
- session parfaite ajoute bonus parfait.
- sticker débloqué après session si disponible.
- catalogue stickers avec IDs uniques.
- stickers répartis dans les collections attendues.
- pas de doublon de sticker de session tant qu’un sticker de session non possédé existe.
- les stickers animés gardent un fallback statique.
- badge première session débloqué une seule fois.
- badge table maîtrisée débloqué une seule fois.
- reset résultats conserve récompenses.
- reset aventure efface récompenses.

### Animations et PWA

- le registre d’animations locales expose les IDs attendus.
- `EdukoAnimation` rend un fallback si l’asset manque ou si les animations sont désactivées.
- la mascotte affiche toujours un contenu accessible.
- les réglages animations/sons persistent.

## Tests manuels MVP

Sur mobile ou émulation :

- l’accueil est lisible.
- les boutons sont faciles à toucher.
- une session complète ne demande pas de clavier.
- l’écran ne saute pas pendant les animations.
- le résumé de session est compréhensible.
- le reset résultats ne supprime pas les stickers.
- l’app build et se lance après déploiement Vercel.
- l’album affiche les collections et reste lisible sur largeur mobile.
- une mission complète rend un sticker visible dans l’album.

## Commandes

```bash
npm run test
npm run build
npm run lint
npm run test:e2e
```

Si une commande n’existe pas, l’ajouter ou documenter le choix dans la PR/le résumé Codex.
