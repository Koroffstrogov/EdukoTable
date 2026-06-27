# EdukoTable — feuille de route v0.2 / v0.3

## Décision produit

La v0.1.0 est une base technique stable, mais pas encore la version réellement attractive pour un enfant.
La suite doit être centrée sur trois manques :

1. visuels et animations Lottie ;
2. collections de stickers animés plus nombreuses ;
3. mode chrono adapté au niveau de l’enfant.

Le reste du backlog reste optionnel.

## Statut actuel

- Lot 6 livré : couche Lottie locale, registre d’animations et branchements UI.
- Lot 6.1 livré : fallbacks statiques robustes pour mascotte et animations.
- Lot 7 livré : album enrichi, 50 stickers locaux en 5 collections, raretés simples et non-doublons de stickers de session.
- Lot 8 reste à faire : mode chrono adaptatif.
- Le backlog court terme v0.2 historique est archivé dans `docs/archive/09-backlog-v0.2.md`.

## Principes

- Ne pas refondre l’application.
- Ne pas complexifier le moteur existant.
- Ne pas créer de boutique, monnaie complexe ou classement.
- Les animations doivent être courtes, désactivables et compatibles mobile.
- Les stickers doivent être un vrai moteur de retour régulier.
- Le chrono doit valoriser la progression, pas créer une pression excessive.

## Version cible

### v0.2 — Attraction & collection

Objectif : rendre EdukoTable désirable pour l’enfant.

Contenu :
- intégration Lottie/dotLottie ;
- mascotte animée ;
- animations de feedback ;
- animation de déblocage de sticker ;
- album enrichi ;
- 50 stickers collectionnables livrés, dans la cible initiale 48 à 60 ;
- logique de récompense plus attractive ;
- tests de non-régression.

### v0.3 — Défi chrono adaptatif

Objectif : ajouter un mode rapide, motivant, adapté au niveau réel ou choisi.

Contenu :
- mode “Défi chrono” ;
- choix de rythme : tranquille, normal, rapide ;
- adaptation simple au niveau observé ;
- mesure du temps de réponse ;
- récompenses spécifiques chrono ;
- tests de domaine et e2e.

---

# Lot 6 — Système d’animations Lottie

Statut : livré.

## Objectif

Installer une couche d’animations propre sans modifier toute l’UI.

## Travail demandé

- Ajouter une dépendance légère pour afficher des animations Lottie/dotLottie.
- Créer un composant générique `EdukoAnimation`.
- Créer un registre local des animations.
- Ajouter des placeholders locaux, sans asset distant en runtime.
- Brancher les animations sur :
  - mascotte idle ;
  - mascotte bravo ;
  - mascotte encouragement ;
  - étoile gagnée ;
  - sticker débloqué ;
  - mission terminée.
- Respecter `settings.animationsEnabled`.
- Respecter `prefers-reduced-motion`.
- Garder les animations courtes : 400 à 1200 ms.
- Ne pas bloquer la progression de la session avec une animation longue.

## Fichiers probables

```txt
src/components/EdukoAnimation.tsx
src/components/Mascot.tsx
src/components/RewardReveal.tsx
src/domain/animations.ts
src/assets/animations/
```

## Tests attendus

- rendu sans crash si une animation manque ;
- pas d’animation active si animations désactivées ;
- e2e : accueil, session, résumé restent utilisables.

---

# Lot 7 — Stickers animés et collections v2

Statut : livré.

## Objectif

Faire des stickers le cœur de l’application.

## Contenu recommandé

Créer 4 ou 5 collections initiales :

```txt
Forêt Eduko
Espace Eduko
Océan Eduko
Machines rigolotes
Créatures amies
```

Nombre cible initial :

```txt
48 stickers minimum
60 stickers idéalement
```

Implémentation actuelle : 50 stickers locaux.

Structure :

```ts
type StickerRarity = "common" | "rare" | "epic";

type Sticker = {
  id: string;
  collectionId: string;
  label: string;
  symbol: string;
  rarity: StickerRarity;
  unlockKind: "session" | "perfect" | "table" | "special";
  animationId?: string;
};
```

## Règles de déblocage

- Mission terminée : 1 sticker non possédé.
- Session parfaite : sticker `perfect-spark` garanti une seule fois.
- Table maîtrisée : sticker spécial de table.
- Chrono : stickers dédiés plus tard.
- Pas de doublons tant que des stickers restent disponibles.
- Pas de boutique.
- Pas de monnaie complexe.

## UI album

- afficher les collections ;
- afficher le compteur par collection ;
- distinguer verrouillé / débloqué ;
- animer le dernier sticker obtenu ;
- prévoir un écran ou panneau “nouveau sticker” après résumé ;
- éviter les grilles trop petites sur mobile.

---

# Lot 8 — Mode chrono adaptatif

## Objectif

Ajouter un mode chrono motivant mais non stressant.

## Positionnement

Nom recommandé :

```txt
Défi chrono
```

Le mode ne remplace pas Mission rapide ni Entraînement ciblé.

## Choix utilisateur

Avant de commencer :

```txt
Rythme tranquille
Rythme normal
Rythme rapide
```

Option simple :

```ts
type ChronoPace = "relaxed" | "normal" | "fast";
```

## Durées de départ

```txt
Tranquille : 12 secondes par question
Normal : 8 secondes par question
Rapide : 5 secondes par question
```

Adaptation simple :

- si l’enfant répond souvent juste mais lentement, garder un temps confortable ;
- si l’enfant répond vite et juste, proposer un rythme plus rapide ;
- ne jamais descendre sous 4 secondes par question ;
- ne jamais compter une absence de réponse comme une faute de connaissance dans les statistiques classiques sans marquage clair.

## Données à ajouter

```ts
type OperationStats = {
  attempts: number;
  correct: number;
  wrong: number;
  lastResult?: "correct" | "wrong";
  lastAnsweredAt?: string;
  timedAttempts?: number;
  totalResponseTimeMs?: number;
  bestResponseTimeMs?: number;
};
```

## Règles de récompense chrono

- bonne réponse : étoile ;
- réponse rapide correcte : petite étoile bonus ou effet visuel ;
- fin de défi : récompense proportionnelle ;
- sticker chrono après certains jalons ;
- pas de punition lourde en cas de temps écoulé.

## Tests attendus

- le timer démarre à l’affichage d’une question ;
- réponse avant expiration : enregistrée avec temps ;
- temps écoulé : passe à la suite ou affiche feedback neutre ;
- les récompenses chrono ne donnent pas un sticker de mission classique si la session n’est pas terminée ;
- rythme choisi persisté ou proposé sans forcer.

---

# Lot 9 — Polish final v0.2/v0.3

## Objectif

Stabiliser l’attractivité sans ouvrir de gros chantier.

## Travail demandé

- vérifier performance mobile ;
- vérifier poids des assets ;
- vérifier absence de débordement horizontal ;
- vérifier réglage animations désactivées ;
- vérifier lisibilité iPhone/Android ;
- compléter documentation ;
- mettre à jour screenshots Playwright ;
- préparer tag `v0.2.0` ou `v0.3.0`.

## Validation

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

---

# Prompts Codex

Les prompts des lots 6 et 7 sont conservés pour contexte historique. Ne pas les
relancer tels quels : ces lots sont déjà livrés.

## Prompt Lot 6 — historique

```md
Tu travailles dans le repo EdukoTable.

Objectif du lot 6 :
ajouter une couche d’animations Lottie/dotLottie propre, locale et désactivable, sans refondre l’application.

Contraintes :
- ne pas modifier le moteur de questions sauf nécessité ;
- ne pas ajouter de fonctionnalité produit majeure ;
- ne pas utiliser d’assets distants en runtime ;
- respecter settings.animationsEnabled ;
- respecter prefers-reduced-motion ;
- garder les animations courtes et non bloquantes ;
- l’app doit rester mobile-first et rapide.

Travail demandé :
1. Installer une solution React pour afficher des animations Lottie ou dotLottie.
2. Créer un composant EdukoAnimation avec fallback simple si l’asset est absent.
3. Créer un registre d’animations local.
4. Ajouter ou préparer des assets locaux pour :
   - mascot-idle ;
   - mascot-happy ;
   - mascot-encouraging ;
   - star-pop ;
   - sticker-unlock ;
   - mission-complete.
5. Brancher progressivement ces animations sur l’accueil, la question, le feedback et le résumé.
6. Ne pas bloquer le passage à la question suivante avec une animation.
7. Ajouter ou adapter les tests nécessaires.
8. Exécuter npm run lint, npm run test, npm run build, npm run test:e2e.

Réponse finale :
résumé, fichiers modifiés, validations, limites restantes.
```

## Prompt Lot 7 — historique

```md
Tu travailles dans le repo EdukoTable.

Objectif du lot 7 :
transformer les stickers en vrai système de collection, avec davantage de stickers et des animations simples.

Contraintes :
- pas de boutique ;
- pas de monnaie complexe ;
- pas de doublons tant qu’il reste des stickers non possédés ;
- garder les récompenses simples ;
- ne pas casser les données existantes ;
- prévoir migration si le modèle change.

Travail demandé :
1. Créer un catalogue de 48 à 60 stickers répartis en collections.
2. Ajouter rareté et type de déblocage.
3. Améliorer la logique de sélection du prochain sticker.
4. Ajouter un écran/panneau de révélation du nouveau sticker.
5. Améliorer l’album avec progression par collection.
6. Utiliser les animations du lot 6 quand disponible.
7. Ajouter tests domaine et e2e.
8. Exécuter npm run lint, npm run test, npm run build, npm run test:e2e.

Réponse finale :
résumé, fichiers modifiés, validations, limites restantes.
```

## Prompt Lot 8 — recommandé

```md
Tu travailles dans le repo EdukoTable.

Objectif du lot 8 :
ajouter un mode Défi chrono adapté au niveau ou au rythme choisi par l’utilisateur.

Contraintes :
- le chrono doit être motivant, pas punitif ;
- ne pas modifier les modes Mission rapide et Entraînement ciblé ;
- ne pas compter un timeout comme une erreur classique sans logique explicite ;
- garder des sessions courtes ;
- garder l’UI mobile-first.

Travail demandé :
1. Ajouter le mode Défi chrono sur l’accueil.
2. Ajouter un choix de rythme : tranquille, normal, rapide.
3. Ajouter un timer visuel clair sur l’écran question.
4. Mesurer responseTimeMs pour les réponses chrono.
5. Ajouter une adaptation simple du temps selon le rythme et les performances.
6. Ajouter des récompenses chrono simples.
7. Ajouter badges ou stickers chrono si le système de stickers v2 existe.
8. Ajouter tests domaine et e2e.
9. Exécuter npm run lint, npm run test, npm run build, npm run test:e2e.

Réponse finale :
résumé, fichiers modifiés, validations, limites restantes.
```
