# Prompt Codex — poursuite d’objectif EdukoTable

Objectif : créer le MVP de la PWA React/Vite **EdukoTable**.

Avant de coder, lis `AGENTS.md` puis les docs dans `docs/`, en particulier `01-mvp-spec.md`, `03-domain-model.md`, `04-question-engine.md`, `05-reward-system.md` et `07-testing-plan.md`. Utilise les skills `.agents/skills/*` pertinents.

Construis une application mobile-first pour réviser les tables de multiplication de 2 à 10.

Contraintes produit :
- nom visible : EdukoTable ;
- PWA déployable sur Vercel ;
- pas de compte, pas de backend ;
- stockage local versionné ;
- sessions de 10 questions ;
- 4 propositions par question ;
- pas de saisie clavier ;
- sélection enfant-friendly des tables : table seule, groupes rapides, sélection personnalisée ;
- une table sélectionnée peut apparaître à gauche ou à droite ;
- suivi simple par opération : attempts, correct, wrong, lastResult, lastAnsweredAt ;
- mode mission rapide aléatoire ;
- mode entraînement ciblé pondéré par difficultés ;
- éviter les répétitions immédiates des mêmes multiplications, des paires commutatives et des mêmes ensembles de propositions ;
- système de récompenses dès le MVP : étoiles, stickers, badges, mascotte ;
- reset résultats sans perdre les récompenses ;
- reset aventure complet avec confirmation.

Approche technique :
- TypeScript strict ;
- fonctions de domaine pures dans `src/domain`;
- React pour l’UI ;
- tests unitaires Vitest pour le moteur, les stats, les récompenses et les resets ;
- CSS simple, mobile-first, animations courtes.

Livrables attendus :
1. projet qui démarre avec `npm run dev`;
2. projet qui build avec `npm run build`;
3. tests avec `npm run test`;
4. écrans MVP : accueil, choix des tables, session, résumé/récompenses, album, progression/réglages ;
5. résumé final des choix techniques, fichiers créés et commandes exécutées.
