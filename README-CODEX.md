# EdukoTable

EdukoTable est une PWA React/Vite mobile-first pour réviser les tables de multiplication de 2 à 10 avec des sessions courtes, des propositions tactiles et des récompenses locales.

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

L’application Vite démarre en local et garde la progression dans `localStorage`.

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

Les tests unitaires couvrent surtout le domaine. Les tests Playwright vérifient une navigation mobile simple : accueil, album, progression, réglages et démarrage de session.

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
