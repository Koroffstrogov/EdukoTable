# EdukoTable — pack de démarrage Codex

Ce dossier contient les fichiers à copier à la racine du repo avant de lancer Codex en mode poursuite d’objectif.

## Installation rapide

Depuis le dossier où ce pack a été extrait :

```bash
cp -R .agents AGENTS.md docs prompts README-CODEX.md /chemin/vers/ton/repo/
```

Puis ouvre Codex depuis la racine du repo.

## Contenu

```txt
AGENTS.md
docs/
  00-product-brief.md
  01-mvp-spec.md
  02-architecture.md
  03-domain-model.md
  04-question-engine.md
  05-reward-system.md
  06-ui-ux.md
  07-testing-plan.md
  08-pwa-vercel.md
prompts/
  codex-pursue-goal.md
  codex-first-implementation-lot.md
.agents/
  skills/
    edukotable-product-guardian/
    edukotable-question-engine/
    edukotable-reward-system/
    edukotable-mobile-pwa-ui/
    edukotable-quality-review/
```

## Ordre conseillé

1. Copier les fichiers à la racine du repo.
2. Lancer Codex.
3. Donner le prompt `prompts/codex-pursue-goal.md`.
4. Demander ensuite à Codex de travailler par lots courts et vérifiables.

## Décisions produit non négociables

- Nom de l’application : **EdukoTable**.
- PWA React/Vite, mobile-first, compatible iPhone et Android.
- Pas de compte, pas de backend, stockage local.
- Tables de 2 à 10.
- Sessions courtes de 10 questions.
- Questions à 4 propositions.
- Pas de saisie clavier.
- Suivi simple par opération : tentatives, réussites, erreurs, dernier résultat, date.
- Taux de réussite par opération.
- Moteur aléatoire simple + moteur d’entraînement ciblé.
- Système de récompenses dès le MVP : étoiles, stickers, badges, réactions de mascotte.
- Éviter les répétitions immédiates des mêmes multiplications et des mêmes ensembles de propositions.
- Deux réinitialisations séparées : résultats seuls, ou aventure complète.
