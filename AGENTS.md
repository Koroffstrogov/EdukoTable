# AGENTS.md — EdukoTable

## Projet

EdukoTable est une PWA React/Vite mobile-first destinée aux enfants pour réviser les tables de multiplication de 2 à 10.

Le produit doit rester simple, fluide et gratifiant. L’application doit fonctionner sans compte, sans serveur, avec stockage local, et être déployable sur Vercel.

## Documentation à lire avant d’implémenter

Avant toute modification fonctionnelle importante, lire les documents pertinents :

- `docs/00-product-brief.md`
- `docs/01-mvp-spec.md`
- `docs/02-architecture.md`
- `docs/03-domain-model.md`
- `docs/04-question-engine.md`
- `docs/05-reward-system.md`
- `docs/06-ui-ux.md`
- `docs/07-testing-plan.md`
- `docs/08-pwa-vercel.md`

Pour un travail spécialisé, utiliser les skills repo-scoped dans `.agents/skills`.

## Règles produit

- Nom affiché : **EdukoTable**.
- Public : enfant, environ 7 ans et plus.
- Tables : 2 à 10.
- Une table sélectionnée peut apparaître à gauche ou à droite.
  - Exemple : table 6 sélectionnée inclut `6 × 7` et `7 × 6`.
- Session standard : 10 questions.
- Question : une multiplication + 4 propositions.
- Pas de saisie clavier.
- Feedback immédiat.
- Récompenses visibles dès le MVP.
- Pas de pénalité punitive, pas de classement, pas de vies perdues.
- Pas de session longue par défaut.
- Pas d’interface de statistiques complexe côté enfant.

## Règles moteur

- Suivre les opérations ordonnées séparément : `6×7` et `7×6` ont des stats distinctes.
- Calculer aussi une `pairKey` commutative pour éviter les répétitions immédiates de paires similaires.
- Éviter :
  - la même opération deux fois de suite ;
  - la même opération dans les 3 dernières questions si le pool le permet ;
  - la paire commutative immédiatement après, si le pool le permet ;
  - le même ensemble de 4 propositions sur deux questions consécutives ;
  - la même position de bonne réponse trop souvent ;
  - plus de 2 mêmes résultats corrects d’affilée, si le pool le permet.
- Le mode aléatoire doit rester équilibré.
- Le mode entraînement doit favoriser les opérations peu tentées, fragiles, difficiles ou ratées récemment.
- Le suivi doit rester simple : `attempts`, `correct`, `wrong`, `lastResult`, `lastAnsweredAt`.

## Règles récompenses

- Récompense immédiate après bonne réponse : étoile + animation courte.
- Récompense de session : bonus de fin + sticker possible.
- Récompense de jalon : badge, sticker spécial ou étoiles bonus.
- Toujours valoriser la fin de session, même avec des erreurs.
- Ne jamais retirer d’étoiles après une erreur.
- Ne pas utiliser de streak punitif qui disparaît.
- Proposer deux resets :
  - réinitialiser les résultats sans supprimer les récompenses ;
  - recommencer toute l’aventure avec confirmation forte.

## Règles UI

- Mobile-first.
- Gros boutons.
- Typographie lisible.
- Cartes arrondies.
- Animations courtes, non bloquantes.
- Charte non genrée.
- Interface utilisable au doigt sur iPhone et Android.
- Prévoir un réglage animations réduites / sons désactivés si les sons sont implémentés.
- Les écrans MVP sont :
  - accueil ;
  - choix des tables ;
  - session de questions ;
  - résumé/récompenses ;
  - album ;
  - progression/réinitialisation.

## Règles techniques

- TypeScript strict.
- Préférer des fonctions de domaine pures et testées.
- Ne pas mélanger logique de domaine et composants React.
- Garder les dépendances faibles.
- Ne pas ajouter de librairie lourde d’animation pour le MVP sauf justification.
- Préférer CSS, transitions simples et composants React.
- Stockage local versionné avec migration.
- Vérifier que l’app build sur Vercel.

## Tests attendus

Implémenter ou maintenir des tests unitaires pour :

- génération des opérations ;
- filtrage par tables sélectionnées ;
- génération des 4 propositions ;
- absence de doublons dans les propositions ;
- évitement des répétitions immédiates ;
- mise à jour des stats ;
- pondération du mode entraînement ;
- calcul des récompenses ;
- reset résultats vs reset aventure.

Avant de considérer une tâche terminée :

```bash
npm run lint
npm run test
npm run build
```

Si un script n’existe pas encore, le créer ou expliquer clairement pourquoi il n’existe pas.
