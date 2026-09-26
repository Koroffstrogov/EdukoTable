# Design QA — Les Fabuleuses, cinquième lot

Date : 26 septembre 2026.

final result: passed

## Périmètre et preuves

Fluoribelle, Sacapouic et Uranounet 235, quatre évolutions chacun. Le catalogue
contient 60 cartes et quinze familles. Référence artistique : Ronronova,
Impératrice des étoiles, choisie par l'utilisateur. Le rapport précédent est
conservé dans `docs/qa/fabuleuses-lot-4/design-qa.md`.

- Aperçu : `http://127.0.0.1:4174/`, Album, Les Fabuleuses.
- Source de style : `public/cards/fabuleuses/ronronova-4.webp`.
- Sources comparées au rendu : `public/cards/fabuleuses/fluoribelle-1.webp`,
  `sacapouic-1.webp`, `uranounet-1.webp`, chacune 768 × 1024.
- Captures : `docs/qa/fabuleuses-lot-5/fluoribelle-390.png`,
  `sacapouic-390.png`, `uranounet-390.png`.
- Comparaisons source à gauche / rendu à droite : `fluoribelle-comparison.png`,
  `sacapouic-comparison.png`, `uranounet-comparison.png`, dans le même dossier.
- Contrôle des formes finales : `fluoribelle-final-320.png`,
  `sacapouic-final-320.png`, `uranounet-final-320.png`.
- Sélecteur : `families-320.png` ; grand écran : `album-desktop.png`.
- Douze illustrations inspectées : `new-families.jpg`, 1240 × 1250.
- Vue des trois fiches : `preview.jpg`, 1157 × 836.
- Identités, titres et ensemble de prompts : `docs/09-fabuleuses.md`, cinquième lot.

## Normalisation et état

Viewports contrôlés : 320 × 568, 390 × 844 et 1280 × 900 CSS. DPR : 1.
Le fournisseur capture respectivement 305 × 541, 375 × 812 et 1265 × 889 pixels.
La comparaison porte sur le premier stade ouvert en aperçu, animation terminée.
À 390 × 844, chaque image occupe 288 × 384 CSS à (36, 104.765625).
La zone (35, 101, 312, 470) de la capture donne 277 × 369 pixels. La source
est réduite à la même taille puis affichée côte à côte dans une image 594 × 413.
Les trois comparaisons ont été ouvertes et inspectées, ainsi que les vues complètes.
Le léger lissage des captures est lié à cette mise à l'échelle, sans agrandissement
des miniatures dans les fiches.

## Constats et surfaces de fidélité

Aucun problème P0/P1/P2 restant. Première comparaison du rendu acceptée.

- **Typographie** : nom, titre, numéro, rareté et stade sont intégrés au raster.
  Les mêmes textes sont accessibles dans l'interface. Georgia pour les titres,
  police système pour les contrôles, hiérarchie inchangée. Les noms tiennent à
  320 pixels ; Uranounet 235 passe proprement sur deux lignes dans le sélecteur.
- **Espacement et disposition** : cinq rangées de trois compagnons, deux colonnes
  de cartes, ratio 3:4 complet. Boutons tactiles et fermeture toujours accessibles.
  Le défilement vertical du catalogue est attendu ; aucun débordement horizontal
  dans l'album ou les dialogues. Cadres et illustrations non rognés.
- **Couleurs** : cohérence opale/or/rose/lilas avec la collection ; arc-en-ciel du
  surligneur, prune/framboise du sac et corail/lavande du noyau distinguent les
  personnages. Contrastes et couleurs de rareté de l'interface conservés.
- **Images** : douze générations natives distinctes ; pointe biseautée visible,
  vrai sac à bretelles avec attributs de diablotin, noyau perlé et médaillon U-235.
  Les silhouettes restent reconnaissables à chaque évolution. Les 60 WebP
  totalisent 18,72 Mio ; quinze miniatures 120 × 160 totalisent 127,3 Kio.
  Les grands visuels sont chargés à la demande. Aucune illustration CSS/SVG ajoutée.
- **Contenu** : numéros 009–012, 069–072 et 097–100 sans collision. La carte 100
  n'augmente pas artificiellement le compteur, qui indique 60 cartes. Pouvoirs,
  secrets et objectifs présents ; la consultation reste explicitement un aperçu.
  Uranounet est un personnage fantastique, sans prétention de schéma scientifique.
  Sacapouic est démoniaque et farceur, adapté au public de l'application.

Les gemmes sont décoratives ; leur nombre ne définit pas la rareté.

## Historique de préparation des assets

Un premier rendu de Sacapouic stade 4 avait un portrait trop étroit. Avant
intégration, une édition native ImageGen a corrigé le format en 1086 × 1448,
exactement 3:4, sans étirement ni rognage. Le PNG retenu est
`C:/Users/Seb/.codex/generated_images/01a0ceb1-a6f0-7dd1-aea9-266e6f2e81c0/exec-3b67c2b7-c7b7-429e-b43b-047bc57b4617.png`.
Le WebP réduit à 768 × 1024 a été inspecté sur la planche complète puis dans
`sacapouic-final-320.png` : cadre entier, textes et personnage conservés.
Aucune correction CSS ou autre écart visuel de l'interface n'a été nécessaire.

## Parcours et validations

Le navigateur intégré a permis de parcourir les trois familles et leurs fiches,
vérifier les grandes images 768 pixels, les quinze miniatures 120 pixels,
le retour du focus et les formats compact/standard/bureau. Après disponibilité
des douze assets, rechargement puis parcours des trois familles : aucune erreur
ni avertissement console. L'album affiche 60 cartes et quinze compagnons.
Les overrides de viewport sont retirés et l'aperçu reste ouvert.

- `npm run lint` : réussi.
- `npm run test` : 92 tests réussis.
- `npm run build` : réussi ; avertissement préexistant `eval` dans lottie-web.
- `npm run test:e2e` : 70 tests réussis (35 Chromium mobile et 35 WebKit/iPhone),
  3,5 minutes, sortie 0. Le serveur de test a été arrêté après les 70 résultats
  pour débloquer sa fermeture Windows ; l’aperçu 4174 reste actif.

La couverture porte sur les anciens albums v3 de trois, six, neuf et douze
familles, la conservation des progrès partiels/complets, les jalons 1/2/4/7,
le gain malgré les erreurs, les resets et les rechargements. Les tests mobiles
consultent les dernières formes, choisissent les compagnons et gagnent Uranounet
après dix erreurs tout en conservant Shampouff. Ils vérifient aussi les 60 images
HTTP réelles, le focus, Échap et les animations réduites.

## Limites et suite

Validation réalisée dans l'aperçu local. Sauvegarde locale à l'appareil et pas de garantie
de premier chargement hors ligne. Aucun changement de schéma (v3), de moteur de
questions ou de calcul d'étoiles ; aucune nouvelle dépendance.

P3 pour un prochain lot : envisager un filtre par univers avec la croissance vers
25 familles, afin de limiter la hauteur du sélecteur. Aucun blocage pour les quinze
familles actuelles.
