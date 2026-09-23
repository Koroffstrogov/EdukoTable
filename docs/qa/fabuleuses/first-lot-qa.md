# Design QA — Les Fabuleuses

Date : 23 septembre 2026.

final result: passed

## Cible et preuves

La référence choisie est la deuxième illustration : Ronronova, Impératrice des
étoiles. Le périmètre de fidélité est la carte elle-même. L'album autour utilise
les composants de l'application existante ; aucun écran complet n'avait été fourni.

- Source visuelle originale : `C:/Users/Seb/.codex/generated_images/01a0cd93-47c5-7492-92e1-83b3fd4d69a8/exec-c40ed7c2-e6ea-4ee7-911f-bae82f958650.png` (1086 × 1448).
- Source intégrée : `public/cards/fabuleuses/ronronova-4.webp` (768 × 1024).
- Implémentation : `http://127.0.0.1:4174/`, Album, aperçu de Ronronova stade 4.
- Capture navigateur : `docs/qa/fabuleuses/ronronova-dialog.png`.
- Comparaison source à gauche / rendu à droite : `docs/qa/fabuleuses/reference-comparison.png`.
- Vue d'ensemble des douze assets inspectés : `docs/qa/fabuleuses/twelve-cards.jpg`.
- Album avant / après : `docs/qa/fabuleuses/album-before.png`, `album-after.png`.
- Autres états : `docs/qa/fabuleuses/mobile-320.png`, `album-desktop.png`.

Captures réalisées dans le navigateur intégré Codex. Vue mobile CSS 390 × 844,
devicePixelRatio 1 ; le fournisseur de capture a produit 375 × 812 pixels.
La carte mesure 288 × 384 CSS px à x=36, y=104,765625. La comparaison utilise
son extrait normalisé à 277 × 369 pixels, à côté de l'original réduit aux mêmes
dimensions. La capture 320 × 568 est fournie en 305 × 541 pixels. Ces réductions
du fournisseur sont prises en compte avant de juger la fidélité ; elles ne sont
pas des recadrages de l'illustration dans l'application.

## Constats et corrections

1. **P2 corrigé — illustrations trop bas dans l'album.** La première capture
   montrait surtout des explications ; les cartes commençaient au bas de l'écran.
   Le choix du compagnon reste avant la grille, les explications détaillées passent
   après. La seconde capture, au même viewport et dans le même état, montre les
   deux premières cartes avec leurs noms et raretés.
2. **P2 corrigé — retour du focus Safari.** Un clic tactile ne focalisait pas
   automatiquement le bouton d'origine. Le bouton est désormais focalisé à
   l'ouverture ; la fermeture restaure ce focus. Le test sous WebKit passe.
3. **P2 corrigé — barre horizontale à 320 px avec une scrollbar classique.**
   Le `min-width: 320px` historique sur `body` dépassait les 305 px disponibles.
   Il est supprimé. Après correction : bodyScrollWidth = documentScrollWidth =
   clientWidth = 305 ; la fiche a scrollWidth = clientWidth = 250. La capture
   `mobile-320.png` montre le résultat et les assertions E2E contrôlent maintenant
   la largeur utile du document et du dialogue.
4. **Cadre préservé.** Le rayon ajouté en CSS sur l'illustration a été retiré pour
   conserver les coins et ornements de la carte source. Le bouton Fermer reste
   visible en faisant défiler la fiche.

Aucun P0/P1/P2 restant. Aucun blocage de capture ou de comparaison.

## Cinq surfaces de fidélité

- **Typographie :** nom, sous-titre, rareté, numéro et évolution restent dans
  l'image d'origine. Les métadonnées sont répétées en texte accessible autour.
  Le titre de collection utilise Georgia ; les contrôles conservent la police
  système de l'application. Cette extension ne prétend pas remplacer la police
  illustrée par une police web.
- **Espacement :** illustration entière au ratio 3:4, deux colonnes sur mobile,
  trois boutons de famille, cibles tactiles d'au moins 44 px. L'album reste
  centré à la largeur de l'application sur desktop. Aucun débordement résiduel.
- **Couleurs :** palette rose/lilas, opale et or conservée dans les assets.
  Surface de l'album #faf5fd et texte #39294e. Les raretés sont aussi nommées ;
  aucun état n'est transmis uniquement par la couleur.
- **Images :** la carte sélectionnée est réutilisée, les onze autres illustrations
  ont la même direction artistique. Pas de dessin CSS, emoji ou asset provisoire.
  La comparaison montre la même composition et les mêmes textes ; le lissage
  du navigateur et la réduction des captures expliquent une légère perte de
  micro-détails face à la source PNG. Les images WebP sont nettes à la taille
  d'affichage et ouvrables en grand.
- **Contenu :** 12 cartes réellement disponibles, huit raretés, quatre évolutions
  par famille. Aperçu et possession sont distingués. Les objectifs correspondent
  aux jalons 1/2/4/7 ; les erreurs ne diminuent pas la progression. Le projet de
  100 cartes reste identifié comme la suite envisagée.

La comparaison ciblée porte sur la carte entière, qui est l'unique visuel source
sélectionné. Aucun recadrage supplémentaire n'est nécessaire : le titre, le bandeau
de rareté, les coins, le numéro et le personnage sont visibles dans cette paire.

## Interactions et validation

- Choix et changement de compagnon, fiche de carte, bouton Fermer, Échap,
  retour du focus, guide des raretés et navigation vers l'album contrôlés.
- Mission terminée avec erreurs, gain du premier stade, sauvegarde/rechargement
  et dernier stade contrôlés sous Chromium mobile et WebKit/iPhone.
- Révélation 800 ms, désactivable par réglage et préférence système ; contrôle
  des animations réduites à 320 × 568.
- Console du navigateur intégré : aucune erreur ni alerte applicative.
- `npm run lint` : succès.
- `npm run test` : 76 tests réussis.
- `npm run build` : succès. Avertissement préexistant de lottie-web sur eval.
- `npm run test:e2e` : 62 tests réussis après correction Safari et attente de
  l'initialisation du stockage dans le test.
- Après la dernière correction CSS, 16 tests ciblés album/Fabuleuses/responsive
  ont été rejoués et réussis sur les deux navigateurs.

Sur cet environnement Windows, le serveur Playwright de test a dû être arrêté
après la fin des assertions pour terminer le teardown ; les commandes ont ensuite
retourné le code 0. Le serveur d'aperçu sur le port 4174 reste actif.

## Suite et limites

Le lot est prêt à essayer localement. Les 88 cartes supplémentaires restent à
illustrer et à intégrer après retour sur ce pilote. Le stockage est local ; le
premier chargement des assets hors connexion n'est pas garanti sans service worker.
L'aperçu reste ouvert dans Codex ; aucune publication n'est effectuée dans ce lot.
