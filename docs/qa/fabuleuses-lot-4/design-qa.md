# Design QA — Les Fabuleuses, quatrième lot

Date : 26 septembre 2026.

final result: passed

## Périmètre et preuves

Poussinelle, Loutrelune et Shampouff, quatre évolutions illustrées chacune.
L'album contient 48 cartes et douze familles. La direction artistique reste
celle de Ronronova, Impératrice des étoiles, choisie par l'utilisateur.
Le précédent rapport est archivé dans `docs/qa/fabuleuses-lot-3/design-qa.md`.

- Aperçu local : `http://127.0.0.1:4174/`, Album, Les Fabuleuses.
- Référence de style : `public/cards/fabuleuses/ronronova-4.webp`.
- Sources visuelles comparées : `public/cards/fabuleuses/poussinelle-4.webp`,
  `loutrelune-4.webp`, `shampouff-4.webp`, chacune en 768 × 1024.
- Captures navigateur : `docs/qa/fabuleuses-lot-4/poussinelle-390.png`,
  `loutrelune-390.png`, `shampouff-390.png`.
- Comparaisons côte à côte source/rendu : `poussinelle-comparison.png`,
  `loutrelune-comparison.png`, `shampouff-comparison.png` dans le même dossier.
- Les douze cartes inspectées ensemble : `new-families.jpg` (1240 × 1250).
- Petit écran : `album-320.png`, `new-families-320.png`, `poussinelle-320.png`.
- Grand écran : `album-desktop.png`.
- Identités, titres et direction des prompts : `docs/09-fabuleuses.md`, quatrième lot.

## Viewports, densité et état

Contrôles à 320 × 568, 390 × 844 et 1280 × 900 CSS. DPR du navigateur intégré : 1.
Les captures du fournisseur sont respectivement 305 × 541, 375 × 812 et
1265 × 889 pixels. Cette mise à l'échelle est prise en compte dans les comparaisons.

État comparé : dernière évolution ouverte en aperçu, animation terminée, carte
non acquise. La carte occupe 288 × 384 CSS à (36, 104.765625) dans chaque dialogue
à 390 × 844. La capture est recadrée à (35, 101, 312, 470), soit 277 × 369 pixels.
La source est réduite aux mêmes dimensions ; les deux vues sont placées côte à
côte dans une image 594 × 413 puis ouvertes ensemble pour inspection. Les cadres,
la typographie intégrée et les personnages restent entiers. Le léger lissage du
rendu provient de la capture redimensionnée ; aucun agrandissement d'une miniature
n'est utilisé dans la fiche.

## Constats et cinq surfaces de fidélité

Aucun problème P0/P1/P2 constaté. Première comparaison acceptée ; aucune correction
visuelle n'a été nécessaire pour ce lot.

- **Typographie** : titres et raretés peints conservés dans les images ; Georgia
  pour les titres de fiche et police système pour les contrôles. Noms et textes
  accessibles reprennent exactement le catalogue, accents compris. Les douze noms
  de familles tiennent à 320 pixels sans troncature ni débordement. Les titres longs
  passent à la ligne dans les fiches.
- **Espacement et disposition** : quatre rangées de trois compagnons, deux colonnes
  de cartes, ratio 3:4, grands boutons tactiles. Cadres complets et aucune déformation.
  Le sélecteur s'allonge d'une rangée ; le défilement vertical est attendu. Aucun
  défilement horizontal aux trois tailles contrôlées, ni dans les dialogues.
- **Couleurs** : cadres or/opale et rose/lilas holographique cohérents avec Ronronova.
  Les trois identités se distinguent par le vert végétal, la fourrure brune et l'opale
  du flacon. Fond de fiche et couleurs de rareté existants conservés.
- **Images** : douze illustrations natives distinctes, aucune approximation CSS/SVG.
  Anatomies et identités contrôlées : visage-feuille et pot, loutre à queue effilée,
  flacon avec clapet et pictogramme de mèche. Les quatre stades augmentent la magie.
  48 WebP de 768 × 1024 totalisent 14,87 Mio ; les douze miniatures 120 × 160
  totalisent 102 Kio. Les grands visuels restent chargés à la demande.
- **Contenu** : numéros 005–008, 045–048 et 065–068 sans collision ; noms, titres,
  raretés et stades corrects. Pouvoirs et secrets humoristiques présents dans chaque
  fiche. Mention explicite d'aperçu et objectif de missions ; consulter ne débloque
  aucune carte. Le shampooing possède un univers de salle de bain distinct.

Les gemmes sous les titres sont décoratives, leur nombre ne définit pas la rareté.
Le texte de rareté est la référence, également disponible hors image.

## Interactions et vérifications

Le navigateur intégré a servi à parcourir les trois familles, ouvrir leurs formes
finales, fermer les fiches et vérifier le retour du focus à la carte. Les douze
miniatures chargent en 120 pixels natifs. Les grandes fiches chargent en 768 pixels.
Le rechargement affiche 48 cartes et douze familles. Après la disponibilité de tous
les assets, un nouveau chargement et la consultation des trois familles ne produisent
aucune erreur ni avertissement console. Les overrides de viewport ont été retirés
et l'album reste ouvert.

- `npm run lint` : réussi.
- `npm run test` : 88 tests réussis.
- `npm run build` : réussi ; avertissement préexistant `eval` de lottie-web.
- `npm run test:e2e` : 68 tests réussis, 34 sous Chromium mobile et 34 sous
  WebKit/iPhone, en 4,0 minutes, sortie 0. Le processus de serveur de test a été
  arrêté après les 68 résultats pour débloquer sa fermeture Windows ;
  le serveur de prévisualisation 4174 reste actif.

Les tests incluent les anciens albums v3 de trois, six et neuf familles, les
progrès partiels et complets, la sélection du compagnon, les 48 images HTTP réelles,
les huit raretés, les gains malgré les erreurs, les jalons 1/2/4/7, les resets,
la persistance, le focus, Échap et les animations réduites.

## Limites et suite

Sauvegarde locale à l'appareil ; pas de garantie de premier chargement hors ligne.
Ce lot est disponible dans l'aperçu local. Le schéma reste v3 et aucune dépendance
n'est ajoutée. Aucun changement au moteur de questions ou au calcul des étoiles.

P3 pour l'extension future : ajouter un filtre par univers si le catalogue devient
trop long à parcourir en allant vers 25 familles. Aucun blocage pour les douze actuelles.
