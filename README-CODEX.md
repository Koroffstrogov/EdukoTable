# EdukoTable

EdukoTable est une PWA React/Vite mobile-first pour réviser les tables de multiplication de 2 à 10 avec des sessions courtes, des propositions tactiles et des récompenses locales.

Les missions standard et l’entraînement ciblé utilisent 4 propositions. Le mode
optionnel « Défi 6 choix » reprend les mêmes sessions de 10 questions avec une
grille 2 × 3 et davantage de distracteurs plausibles.

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

Les tests unitaires couvrent surtout le domaine et le stockage local. Les tests Playwright vérifient la navigation mobile, les réglages persistés, l’abandon sans sticker, les missions complètes à 4 et 6 choix et l’absence de débordement horizontal aux largeurs 320, 375, 390 et 430 px.

Les régressions de session sont vérifiées avec une horloge contrôlée : étoiles
conservées après rechargement pendant le feedback, pause du dialogue de sortie,
reprise et fin de mission sans double attribution des récompenses.

Le workflow `.github/workflows/validate.yml` lance `npm run validate` sur les
pull requests et les push sur `main`, avec Node.js 24 et les deux moteurs mobiles.
En CI, Playwright utilise le build de production via `vite preview` ; en local,
il démarre le serveur de développement. Le rapport HTML et les traces d’échec
sont conservés pendant 7 jours dans les artefacts GitHub Actions.

Les parcours E2E sont exécutés sur Chromium mobile et WebKit avec un profil
iPhone. Installer les deux moteurs avant la première exécution :

```bash
npx playwright install chromium webkit
```

Pour générer une capture ponctuelle pendant un audit mobile :

```bash
npm run dev
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:5173 test-results/mobile-home.png
```

Le dossier `test-results/` n’est pas publié.

## Documentation projet

La feuille de route active est `docs/edukotable-roadmap-v0.2-v0.3.md`.
Les documents historiques qui ne doivent plus guider l’implémentation sont dans
`docs/archive/`.

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

La mascotte principale Edukobi est un SVG local dans `src/assets/edukobi.svg`.
Elle reste visible sous les effets Lottie et sert de fallback lorsque les
animations sont désactivées, réduites ou indisponibles.

`index.html` référence le manifest, la couleur de thème, l’icône iPhone et les balises utiles pour l’affichage mobile.

## Stickers et animations

Le catalogue de stickers est local, défini dans `src/domain/stickers.ts`.

- 50 stickers sont répartis en collections.
- Il n’y a pas de boutique, pas de monnaie complexe et pas de doublon tant qu’un sticker de session reste disponible.
- Les visuels de stickers sont rendus avec du CSS local.
- Quelques stickers rares ou épiques peuvent utiliser une animation Lottie locale.
- Chaque animation conserve un fallback statique pour les animations désactivées, `prefers-reduced-motion`, ou un asset indisponible.

Le Défi 6 choix possède aussi la collection locale `La Bande des Six`, définie
dans `src/domain/challengeCards.ts` : six cartes à objectifs déterministes,
révélées dans l’ordre et affichées au format vertical dans l’album. Une carte
de jalon remplace le sticker de session lorsque le jalon est atteint.

## Données locales

La progression, les réglages, étoiles, stickers, cartes et badges sont stockés localement sous la clé `edukotable:v1`.
Le champ de version interne `AppState.version` est migré vers `2` pour ajouter
le suivi du Défi 6 choix sans perdre les données existantes.

Conséquences :

- les données ne sont pas synchronisées entre appareils ;
- vider les données du navigateur supprime la progression ;
- “Réinitialiser les résultats” conserve les récompenses ;
- “Recommencer toute l’aventure” remet aussi les récompenses à zéro.

Si le navigateur refuse une écriture `localStorage`, la session continue en
mémoire et un message discret indique que la progression ne pourra peut-être
pas être retrouvée après fermeture.

Chaque bonne réponse enregistre immédiatement son étoile avec les statistiques.
Recharger pendant une mission conserve ces gains, mais ne reprend pas la mission
en cours. Le résumé affiche le total gagné ; les étoiles déjà enregistrées ne
sont pas créditées une deuxième fois lors de la fin ou de l’abandon.

## Sons

Les sons sont synthétisés localement avec Web Audio, sans fichier distant ni
dépendance supplémentaire. Ils couvrent la bonne réponse, l’encouragement après
une erreur, la fin de mission et le déblocage d’un sticker. Ils sont désactivés
par défaut, restent facultatifs et ne remplacent aucun feedback visuel ou textuel.

## Checklist publication

Avant de considérer une version publiable :

1. Installer les dépendances avec `npm install`.
2. Exécuter `npm run validate`.
3. Vérifier que `npm run build` produit bien `dist/` avec `assets/`, `manifest.webmanifest` et `icons/`.
4. Déployer sur Vercel avec `npm run build` et `dist` comme dossier de sortie.
5. Ouvrir l’URL Vercel sur iPhone Safari et Android Chrome.
6. Vérifier l’accueil, Album, Progression, Réglages et une session complète de 10 questions.
7. Vérifier le Défi 6 choix sur iPhone compact : six réponses uniques, sans scroll pendant la question.
8. Vérifier l’abandon de mission : sans réponse retour accueil, avec réponse résumé partiel sans sticker.
9. Vérifier l’installation mobile : nom EdukoTable, icône lisible, affichage standalone quand disponible.
10. Vérifier que les réglages animations/sons persistent après rechargement.
11. Vérifier les dialogues au clavier : focus initial, Tab, Maj+Tab et Échap.
12. Vérifier qu’aucun chemin local absolu n’apparaît dans les docs ou le code applicatif.
13. Vérifier qu’une session Défi 6 choix révèle une carte et que l’album affiche l’objectif suivant.

## Limites connues du MVP

- Pas de compte, profils multiples ou synchronisation cloud.
- Pas de service worker offline avancé.
- Stickers visuels locaux, encore remplaçables par des illustrations finales.
- Statistiques volontairement simples et locales.
- Les sons Web Audio dépendent du support du navigateur et restent silencieux si
  celui-ci refuse l’initialisation audio.
