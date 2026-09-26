# Design QA — Les Fabuleuses, troisième lot

Date : 23 septembre 2026.

final result: passed

## Périmètre et preuves

Douze nouvelles illustrations : Flûtinelle, Ninachou et Baskétoile, chacune en
quatre évolutions. L'album contient 36 cartes et neuf familles. La référence
choisie reste Ronronova, Impératrice des étoiles. Le rapport du deuxième lot
est conservé dans `docs/qa/fabuleuses-lot-2/design-qa.md`.

- Aperçu : `http://127.0.0.1:4174/`, Album, Les Fabuleuses.
- Direction artistique : `public/cards/fabuleuses/ronronova-4.webp`.
- Source de comparaison : `C:/Users/Seb/.codex/generated_images/01a0ceb1-1b83-7ed1-9117-13401d2f88b7/exec-d8deaab1-ff37-4a41-85d4-24b31c72ecbc.png` (1086 × 1448).
- Asset intégré : `public/cards/fabuleuses/flutinelle-1.webp` (768 × 1024).
- Capture : `docs/qa/fabuleuses-lot-3/flutinelle-dialog.png`.
- Source à gauche / rendu à droite : `docs/qa/fabuleuses-lot-3/flutinelle-comparison.png`.
- Douze cartes inspectées : `docs/qa/fabuleuses-lot-3/new-families.jpg`.
- Sélecteur avant/après correction : `docs/qa/fabuleuses-lot-3/families-320-before.png`, `families-320.png`.
- Formes finales : `flutinelle-final-dialog.png`, `ninachou-320.png`, `basketoile-320.png`, dans le même dossier.
- Album à la taille normale du navigateur : `docs/qa/fabuleuses-lot-3/album-desktop.png`.

La comparaison ciblée porte sur la carte entière dans sa fiche d'aperçu, sans
recadrage de son illustration. Viewport CSS 390 × 844, image de 288 × 384 à x=36,
y=104,765625, après la fin de l'animation. La capture du fournisseur mesure
375 × 812 ; le crop normalisé mesure 277 × 369. La source est réduite à cette
même taille et placée à côté. À 320 × 568, les captures mesurent 305 × 541.
La densité de capture et le lissage du fournisseur expliquent la perte de
micro-détails face à la source ; la composition et les cadres restent identiques.
La flûte, les titres et les ornements sont lisibles dans la comparaison ciblée.

## Constats et correction

**P2 corrigé — nom Pomponnette à 320 px.** Le texte occupait 75,30 px et débordait
l'espace intérieur du bouton : scrollWidth 78 pour clientWidth 76. Le padding
horizontal des boutons est désormais nul jusqu'à 360 px, sans réduire leur police
ou leurs cibles tactiles. La nouvelle capture et la mesure DOM montrent neuf
boutons sans débordement, document scrollWidth = clientWidth = 305. Les tests
navigateur vérifient aussi tous les noms. Les images temporairement manquantes de
la capture initiale sont remplacées par les neuf miniatures finales.

Aucun P0/P1/P2 restant. Aucun blocage de capture ou de comparaison.

## Cinq surfaces de fidélité

- **Typographie :** titres, accents, numéros 085–096, raretés et stades vérifiés.
  Le nom et la rareté intégrés aux images sont aussi disponibles en texte dans
  l'interface. La police Georgia des titres et la police système des commandes
  restent celles de l'album. Les noms du sélecteur restent entiers.
- **Espacement :** cadre 3:4 complet, grille de deux cartes, sélecteur de neuf
  familles sur trois rangées. Cibles de 80 × 95 ou 109 px à 320 px ; aucun
  débordement de la page ou des fiches. Le bouton Fermer reste accessible.
- **Couleurs :** palette opale/or/rose/lilas conservée ; aurores musicales,
  éclipse nocturne et terrain cosmique différencient les trois univers visuels.
  Les raretés sont indiquées par du texte en plus de leur couleur.
- **Images :** douze générations natives Image Gen, sans placeholders. Flûte
  traversière argentée horizontale à clés, ninja acrobatique aux rubans lumineux,
  basketteuse avec ballon et panier reconnaissables. Identités constantes et
  poses/décors/tenues qui progressent. Les gemmes du cadre sont décoratives ;
  le bandeau nommé est la référence de rareté.
- **Contenu :** 36 cartes réellement intégrées, huit raretés existantes, quatre
  stades par famille. Aperçu et possession distingués. Jalons 1/2/4/7 terminés,
  progression conservée en changeant de compagnon et malgré les erreurs.

Les 36 WebP de 768 × 1024 totalisent 11,14 Mio. Les neuf miniatures de 120 × 160
ne totalisent que 76,6 Kio ; la grille charge les grandes images à la demande.
Aucune nouvelle dépendance ni génération à l'exécution.

## Validation

- Neuf familles consultables, trois nouveaux compagnons sélectionnables.
- Sauvegarde v3 de six familles rechargée sans perte ; nouveaux compteurs à zéro.
- Familles partielle et complète préservées ; quatre évolutions gagnées et
  rechargées pour chaque nouvelle famille, sans consommer les précédentes.
- Gain de Baskétoile après dix erreurs en conservant une carte Coralie, sous
  Chromium mobile et WebKit/iPhone.
- Fiches, fermeture, retour du focus, miniatures, 36 réponses WebP et absence de
  débordement vérifiés par les parcours navigateur.
- Console du navigateur intégré après chargement des assets finalisés : aucune
  erreur ni alerte. Préférence de viewport remise à zéro ; album laissé ouvert.
- `npm run lint` : succès.
- `npm run test` : 84 tests réussis.
- `npm run build` : succès ; avertissement préexistant de lottie-web sur eval.
- `npm run test:e2e` : 66 tests réussis, code de sortie 0.

Sous Windows, le serveur de test a été arrêté après les 66 tests pour terminer
le teardown Playwright. Le serveur d'aperçu sur 4174 reste actif.

## Livraison et limites

Les sources, tests et docs sont mis à jour ; les assets et miniatures sont dans
`public/cards/fabuleuses/`. Prompts et catalogue : `docs/09-fabuleuses.md`.
La progression reste locale. Les 64 autres cartes du projet de 100 restent à
illustrer ; elles ne sont pas présentées comme disponibles. L'aperçu local reste
actif, sans publication effectuée dans ce lot.
