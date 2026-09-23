# Design QA — Les Fabuleuses, deuxième lot

Date : 23 septembre 2026.

final result: passed

## Périmètre et références

Ajout de Pétalipop, Pomponnette et Coralie Glouglou : douze illustrations,
quatre évolutions par famille. L'album contient désormais 24 cartes réparties
en six familles. Le premier lot reste intact ; son rapport est conservé dans
`docs/qa/fabuleuses/first-lot-qa.md`.

La référence de style reste Ronronova, Impératrice des étoiles, sélectionnée
par l'utilisateur. Chaque nouvelle illustration reprend son cadre opale/or,
ses reflets holographiques et son format portrait 3:4. L'interface environnante
conserve les composants existants d'EdukoTable.

- Aperçu : `http://127.0.0.1:4174/`, Album, Les Fabuleuses.
- Planche des douze nouvelles cartes : `docs/qa/fabuleuses-lot-2/new-families.jpg`.
- Six familles à 320 px : `docs/qa/fabuleuses-lot-2/families-320.png`.
- Fiche Pétalipop : `docs/qa/fabuleuses-lot-2/petalipop-dialog.png`.
- Source à gauche / rendu à droite : `docs/qa/fabuleuses-lot-2/petalipop-comparison.png`.
- Fiche Coralie à 320 px : `docs/qa/fabuleuses-lot-2/coralie-320.png`.
- Source PNG de Pétalipop stade 4 : `C:/Users/Seb/.codex/generated_images/01a0ceb1-1b83-7ed1-9117-13401d2f88b7/exec-ec887d58-8bef-4504-b99e-265aa50604a0.png`.
- Asset intégré : `public/cards/fabuleuses/petalipop-4.webp`, 768 × 1024.

La comparaison utilise le cadre entier, titre et numéro compris. Au viewport
CSS 390 × 844, l'image mesure 288 × 384 à x=36, y=104,765625. Le fournisseur
de capture produit 375 × 812 pixels : la région correspondante est normalisée
à 277 × 369, et la source réduite aux mêmes dimensions. La capture CSS 320 × 568
est fournie en 305 × 541. Cette réduction explique le léger lissage des détails.

## Fidélité et usage mobile

- **Typographie :** noms, évolutions, raretés et numéros vérifiés sur les douze
  images. Les métadonnées sont aussi affichées en texte accessible dans la fiche.
- **Espacement :** sélecteur de six familles sur deux rangées de trois. Miniatures
  42 × 56 CSS px ; boutons d'environ 80 × 95 ou 109 px à 320 px. Le nom Coralie
  Glouglou revient à la ligne sans être coupé. Aucun débordement horizontal.
- **Couleurs :** rose, lilas, opale et or cohérents ; jardins fleuris, nuages
  étoilés et fonds sous-marins différencient les trois familles.
- **Illustrations :** douze images natives Image Gen inspectées individuellement
  et sur la planche. Les poses, tenues et décors évoluent réellement. Aucun asset
  provisoire. Les cadres et compositions sont préservés dans l'application.
- **Contenu :** 24 cartes disponibles, quatre stades par famille, jalons 1/2/4/7
  missions terminées. Les aperçus sont distingués des cartes possédées ; finir
  une mission avec des erreurs permet toujours de progresser.

Les six miniatures WebP 120 × 160 totalisent environ 49 Kio. Le sélecteur ne
charge plus six illustrations complètes ; les grandes fiches gardent les images
768 × 1024. Les 24 illustrations complètes totalisent environ 7,27 Mio.

Aucun P0/P1/P2 restant. Aucun blocage de capture ou de comparaison.

## Compatibilité et validation

- Sauvegarde v3 du premier lot rechargée : anciennes cartes, compagnon et étoiles
  conservés ; les trois nouveaux compteurs sont initialisés à zéro.
- Progression complète et rechargement vérifiés pour chacune des trois familles.
- Navigation, choix du compagnon, fiches, fermeture, retour du focus et animations
  réduites vérifiés sous Chromium mobile et WebKit/iPhone.
- Réponses HTTP des 24 images, dimensions des miniatures et absence de débordement
  contrôlées par les tests navigateur.
- Console du navigateur intégré après rechargement de tous les assets terminés :
  aucune erreur ni alerte.
- `npm run lint` : succès.
- `npm run test` : 80 tests réussis.
- `npm run build` : succès ; avertissement préexistant de lottie-web sur eval.
- `npm run test:e2e` : 64 tests réussis, code de sortie 0.

Sous Windows, le serveur de test Playwright a été arrêté après la réussite
des 64 tests pour terminer son teardown. Le serveur d'aperçu sur 4174 reste actif.

## Livraison

L'album est prêt à essayer localement. Les 76 cartes restantes du catalogue
envisagé ne sont pas présentées comme disponibles. La progression reste locale
et le premier chargement hors connexion n'est pas garanti sans service worker.
La direction des prompts et les chemins des assets sont documentés dans
`docs/09-fabuleuses.md`.
