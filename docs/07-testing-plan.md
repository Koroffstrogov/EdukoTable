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

Pour le Défi 6 choix :

- retourne 6 propositions ;
- contient 5 distracteurs uniques et plausibles ;
- contient la bonne réponse exactement une fois ;
- la position correcte reste comprise entre 0 et 5 ;
- les protections anti-répétition restent actives.

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
- recharger pendant le feedback conserve l’étoile et les statistiques.
- la fin de session et l’abandon ne créditent pas deux fois les étoiles immédiates.
- le dialogue de sortie suspend le feedback, puis reprend après annulation.
- confirmer la sortie après la dixième réponse termine la session une seule fois.
- session terminée ajoute bonus de complétion.
- session parfaite ajoute bonus parfait.
- sticker débloqué après session si disponible.
- le catalogue « La Bande des Six » contient 6 cartes aux IDs uniques.
- une session Défi 6 choix incrémente ses compteurs dédiés.
- les cartes se débloquent dans l’ordre, sans doublon ni saut de collection.
- un 10/10 ou 10 défis terminés débloque la carte finale.
- une carte de jalon remplace le sticker de session pour cette récompense.
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
- les sons désactivés ne créent pas de contexte audio ;
- l’absence de Web Audio ou de stockage local ne provoque pas de crash ;
- Edukobi reste visible lorsque les animations sont désactivées ou réduites.

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
- une mission Défi 6 choix rend une carte visible dans l’album et affiche son objectif suivant.
- les dialogues conservent le focus, bouclent Tab/Maj+Tab et ferment avec Échap ;
- les parcours principaux passent sous Chromium mobile et WebKit/iPhone.
- le Défi 6 choix tient sans scroll sur un écran 320 × 568.

## Commandes

```bash
npm run test
npm run build
npm run lint
npm run test:e2e
```

Si une commande n’existe pas, l’ajouter ou documenter le choix dans la PR/le résumé Codex.

Le workflow GitHub Actions `validate.yml` exécute les quatre contrôles sur les
pull requests et les push sur `main`. Les E2E utilisent le build de production
en CI et conservent un rapport HTML ainsi que les traces des échecs.

## Couverture du lot Fabuleuses

`src/domain/fairyCards.test.ts` vérifie le catalogue de 60 cartes, les huit
raretés, les jalons 1/2/4/7, le changement de compagnon, les missions avec
erreurs, les deux formats de réponses, l'abandon, les migrations v2/v3,
les données endommagées, la persistance et les deux resets.

`tests/e2e/fabuleuses.spec.ts` vérifie sous Chromium et WebKit le choix du
compagnon, une mission avec dix erreurs, le gain et le rechargement, l'accès
à la dernière évolution, les 60 images WebP réelles, la consultation des
aperçus, Échap, le retour du focus et les animations réduites sur 320 × 568.

Le deuxième lot vérifie également qu'un album v3 contenant seulement les trois
premières familles reçoit les nouveaux compteurs à zéro, sans changer le compagnon
choisi ni perdre ses cartes. Chaque nouvelle famille atteint ses quatre évolutions
en tests unitaires ; les trois familles sont consultées et sélectionnées sur mobile
en E2E, avec un gain de Coralie, une migration et un rechargement.

Le troisième lot vérifie la migration d'un album v3 de six familles, le maintien
d'une famille complète et d'une famille partielle, puis les quatre évolutions de
Flûtinelle, Ninachou et Baskétoile. Le parcours mobile consulte leurs derniers
stades, vérifie le retour du focus et les débordements, recharge le compagnon choisi
et gagne une carte de Baskétoile tout en conservant la carte de Coralie existante.

Le quatrième lot couvre un album v3 de neuf familles, dont plusieurs compagnons
partiellement ou complètement évolués. Les douze nouvelles cartes sont gagnées
et rechargées en tests unitaires. Le parcours mobile consulte les trois familles,
vérifie les images et le focus sur 320 × 568, puis gagne Shampouff après dix erreurs
et recharge l'album en conservant la carte Ninachou déjà acquise.

Le cinquième lot couvre la reprise d'un album v3 de douze familles, avec
Poussinelle, Loutrelune et Shampouff partiellement ou complètement évolués.
Les nouvelles familles gagnent leurs quatre cartes en tests unitaires. En E2E,
leurs formes finales sont consultées et leurs compagnons sélectionnés à 320 pixels ;
une mission avec dix erreurs gagne Uranounet et conserve la carte Shampouff existante.
