# Prompt Codex — lot 1 recommandé

Implémente le premier lot EdukoTable en gardant le scope strict.

Lis `AGENTS.md`, `docs/03-domain-model.md`, `docs/04-question-engine.md`, `docs/05-reward-system.md` et `docs/07-testing-plan.md`.

Lot 1 :
- créer ou adapter un projet Vite React TypeScript ;
- ajouter la structure `src/domain`, `src/storage`, `src/components`, `src/styles` ;
- implémenter les types domaine ;
- implémenter `operations.ts`, `tableSelection.ts`, `progress.ts`, `questionEngine.ts`, `rewards.ts` ;
- ajouter les tests Vitest du domaine ;
- créer une UI minimale mais utilisable : accueil, choix tables, session 10 questions, résumé ;
- stockage local simple ;
- scripts `dev`, `build`, `test`.

Ne pas ajouter de complexité hors MVP. Ne pas ajouter de backend. Ne pas ajouter de librairie lourde d’animation.

Critère de fin :
- `npm run test` passe ;
- `npm run build` passe ;
- une session complète de 10 questions fonctionne ;
- les répétitions immédiates sont évitées autant que possible ;
- les récompenses de base sont visibles.
