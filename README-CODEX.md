# EdukoTable

EdukoTable est une PWA React/Vite mobile-first pour réviser les tables de multiplication de 2 à 10 avec des sessions courtes, des propositions tactiles et des récompenses locales.

## Prérequis

- Node.js récent compatible Vite.
- npm.

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

L’application Vite démarre en local. La progression est conservée dans le navigateur, via `localStorage`.

## Validation

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Ou tout lancer :

```bash
npm run validate
```

Les tests unitaires couvrent surtout le domaine et le stockage local. Les tests Playwright vérifient la navigation mobile, les réglages persistés, l’abandon sans sticker, une mission complète de 10 questions et l’absence de débordement horizontal aux largeurs 320, 375, 390 et 430 px.

Pour générer une capture ponctuelle pendant un audit mobile :

```bash
npm run dev
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:5173 test-results/mobile-home.png
```

Le dossier `test-results/` n’est pas publié.

## Build et Vercel

```bash
npm run build
```

Vercel peut utiliser la configuration Vite par défaut :

- build command : `npm run build`
- output directory : `dist`

Aucun backend et aucun service worker complexe ne sont nécessaires pour le MVP.

## PWA et icônes

Le manifest est dans `public/manifest.webmanifest`.

Les icônes locales sont dans `public/icons/` :

- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`
- `edukotable.svg`

Elles reprennent une mascotte Eduko simple, lisible en petit format.

`index.html` référence le manifest, la couleur de thème, l’icône iPhone et les balises utiles pour l’affichage mobile.

## Données locales

La progression, les réglages, étoiles, stickers et badges sont stockés localement sous la clé `edukotable:v1`.

Conséquences :

- les données ne sont pas synchronisées entre appareils ;
- vider les données du navigateur supprime la progression ;
- “Réinitialiser les résultats” conserve les récompenses ;
- “Recommencer toute l’aventure” remet aussi les récompenses à zéro.

## Checklist publication

Avant de considérer une version publiable :

1. Installer les dépendances avec `npm install`.
2. Exécuter `npm run validate`.
3. Vérifier que `npm run build` produit bien `dist/` avec `assets/`, `manifest.webmanifest` et `icons/`.
4. Déployer sur Vercel avec `npm run build` et `dist` comme dossier de sortie.
5. Ouvrir l’URL Vercel sur iPhone Safari et Android Chrome.
6. Vérifier l’accueil, Album, Progression, Réglages et une session complète de 10 questions.
7. Vérifier l’abandon de mission : sans réponse retour accueil, avec réponse résumé partiel sans sticker.
8. Vérifier l’installation mobile : nom EdukoTable, icône lisible, affichage standalone quand disponible.
9. Vérifier que les réglages animations/sons persistent après rechargement.
10. Vérifier qu’aucun chemin local absolu n’apparaît dans les docs ou le code applicatif.

## Limites connues du MVP

- Pas de compte, profils multiples ou synchronisation cloud.
- Pas de service worker offline avancé.
- Pas de vrais sons pour l’instant, seulement le réglage prêt à brancher.
- Stickers encore textuels/symboliques.
- Statistiques volontairement simples et locales.
