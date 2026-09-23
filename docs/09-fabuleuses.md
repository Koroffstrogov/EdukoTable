# Les Fabuleuses d'Eduko — Le Grand Bal des Merveilles

## Lot livré

Trente-six cartes illustrées : neuf familles de quatre évolutions, livrées en
trois lots de douze cartes. Le catalogue de 100
reste un objectif ; seules les cartes terminées sont proposées dans l'application.
Les 50 stickers et les six cartes de la Bande des Six restent accessibles.

| Famille | Évolution 1 | Évolution 2 | Évolution 3 | Évolution 4 |
| --- | --- | --- | --- | --- |
| Ronronova | Mini-Miaou | Chasseuse de lunes | Duchesse des aurores | Impératrice des étoiles |
| Lunabelle | Bouton de rêve | Galop de rosée | Princesse des nuages | Reine des pétales |
| Pralinette | Pralipouf | Flamme chantilly | Duchesse croquante | Dragonne des cristaux |
| Pétalipop | Pousse-Paillette | Pirouette fleurie | Marquise des jardins | Impératrice du printemps |
| Pomponnette | Pompon de coton | Saute-Nuage | Duchesse du ciel | Gardienne des rêves |
| Coralie Glouglou | Bulle-Bisou | Valse des perles | Princesse des marées | Reine des abysses |
| Flûtinelle | Souffle-Bisou | Mélodie pailletée | Virtuose des vents | Symphonie des aurores |
| Ninachou | Pas de velours | Pirouette invisible | Gardienne de la lune | Éclipse de paillettes |
| Baskétoile | Mini-Rebond | Dribble comète | Duchesse du dunk | Reine du panier cosmique |

Les jalons par compagnon sont 1, 2, 4, 7 missions de dix questions terminées.
Il faut donc 63 missions pour obtenir les 36 cartes, en changeant de compagnon
après chaque famille complète. Les erreurs n'affectent pas les évolutions.

Les cartes ont une rareté, un pouvoir et un secret humoristique. Leur numéro
001–004, 021–028, 041–044, 061–064 ou 081–096 réserve leur place dans la
future série de 100. Le compteur de l'album affiche les 36 cartes jouables.

## Direction artistique et assets

Référence validée : deuxième proposition, le chat Ronronova, Impératrice des étoiles.
Chat lavande aux grands yeux bleu-violet, ailes papillon translucides, cadre opale
et or, château céleste, cape rose et reflets holographiques. Cette image est reprise
pour `ronronova-4.webp`. Les 35 autres images ont été créées individuellement
avec l'outil natif Image Gen en utilisant cette référence et le stade précédent.
Les titres font partie des illustrations ; les mêmes informations sont proposées
en texte accessible dans l'interface.

Assets : `public/cards/fabuleuses/<famille>-<stade>.webp`, 768 × 1024 pixels,
compression WebP qualité 90. Pas de génération
à l'exécution. La grille charge les images paresseusement, la grande fiche et
les révélations immédiatement. Aucun ajout de dépendance.

Le sélecteur des neuf familles utilise des miniatures WebP 120 × 160 dans
`public/cards/fabuleuses/thumbnails/` pour éviter de charger neuf grandes images
avant même de consulter leurs cartes. Les illustrations ouvertes restent en 768 × 1024.

## Extension envisagée à 100

Vingt-cinq familles de quatre évolutions, réparties dans cinq univers.
Les noms ci-dessous constituent une proposition éditoriale, sans assets ni
cartes verrouillées artificiellement dans ce lot.

| Univers | Familles envisagées |
| --- | --- |
| Jardin des Fées Farceuses | Pétalipop, Rosibulle, Frimousse Mousse, Violette Pirouette, Mimosa Malicieuse |
| Royaume des Nuages Sucrés | Lunabelle, Pomponnette, Meringuette, Pluminette, Madame Flocon |
| Archipel des Sirènes Pétillantes | Coralie Glouglou, Perlipop, Médusette, Nacrelune, Bulle-Bisou |
| Confiserie des Dragonnes | Pralinette, Dragimauve, Biscotte Biscornue, Caramélune, Chouquette Flambette |
| Bal des Princesses Cosmiques | Ronronova, Flûtinelle, Ninachou, Baskétoile, Duchesse Dodo |

Répartition envisagée des raretés : 20 Choupinettes, 20 Pailletées,
18 Étincelantes, 15 Féeriques, 12 Royalissimes, 8 Mythiques,
5 Galactastiques et 2 WOUAH ULTIME ! La rareté indique l'ampleur de la magie,
jamais une probabilité de tirage ni un achat nécessaire.

Avant d'ajouter les 64 autres illustrations : recueillir le retour sur les 36,
ajuster si besoin le rythme 1/2/4/7, puis produire famille par famille avec contrôle
de cohérence et de lisibilité. À 25 familles, prévoir un filtre par univers pour
que le choix d'un compagnon reste simple sur mobile.

## Deuxième lot : compatibilité et direction des prompts

Les IDs ajoutés sont `petalipop-1` à `petalipop-4`, `pomponnette-1` à
`pomponnette-4` et `coralie-1` à `coralie-4`. Le schéma reste v3 : c'est une
extension du catalogue. Le chargement initialise les compteurs manquants à zéro
et conserve le compagnon ainsi que toutes les cartes déjà acquises.

Les douze nouveaux assets sont générés individuellement avec l'outil natif
Image Gen, puis réduits en WebP ; aucune illustration n'est dessinée en code.
Prompt commun : illustration féérique peinte, portrait 3:4, grands yeux expressifs,
cadre opale/or, reflets holographiques et textes français exacts. Références :
Ronronova stade 4 pour le style et le stade précédent pour conserver l'identité.
Le nom, le titre du tableau ci-dessus, la rareté, le numéro sur 100 et le stade
d'évolution sont intégrés à chaque image.

| Famille | Identité et progression visuelle | Raretés des stades 1 à 4 |
| --- | --- | --- |
| Pétalipop | Fée enfantine à peau brune, chignons framboise, robe de pétales et ailes de libellule ; tasse-fleur, pirouette et papillons, pont de lianes royal, puis apothéose printanière. | Choupinette, Étincelante, Féerique, Mythique |
| Pomponnette | Lapine crème aux longues oreilles roses et yeux lavande ; nid de coton, bonds entre nuages, couronne et pont arc-en-ciel, puis grandes ailes de rêves étoilés. | Choupinette, Pailletée, Royalissime, Galactastique |
| Coralie Glouglou | Sirène enfantine à peau dorée, boucles lilas, tunique pervenche couvrante et queue turquoise/opale ; coquillage et hippocampe, valse de perles, princesse des récifs, puis reine des jardins sous-marins lumineux. | Pailletée, Étincelante, Féerique, Mythique |

## Troisième lot : musique, acrobaties et basket

À la demande de l'utilisateur, le Bal des Princesses Cosmiques accueille une
joueuse de flûte traversière, une ninja et une basketteuse. Elles occupent les
numéros 085–096 et remplacent trois propositions non illustrées de la feuille de
route. Les numéros et les cartes des deux premiers lots restent inchangés.

Assets : `public/cards/fabuleuses/flutinelle-1.webp` à `flutinelle-4.webp`,
`ninachou-1.webp` à `ninachou-4.webp`, `basketoile-1.webp` à `basketoile-4.webp`.
Une miniature de chaque premier stade est disponible dans `thumbnails/`.

Les douze images sont produites individuellement par l'outil natif Image Gen,
avec Ronronova stade 4 comme référence de style et le stade précédent pour
l'identité. Le prompt commun du deuxième lot s'applique : portrait 3:4, cadre
opale/or entier, grands yeux expressifs, peinture féérique, reflets holographiques,
textes français intégrés exacts. Les titres du tableau, noms, numéros et mentions
« Évolution 1 / 4 » à « Évolution 4 / 4 » sont inclus dans les prompts.

| Famille | Identité et progression visuelle | Raretés des stades 1 à 4 |
| --- | --- | --- |
| Flûtinelle | Peau claire avec taches de rousseur, yeux verts, tresse auburn et robe pervenche ; flûte traversière argentée à clés, horizontale aux lèvres et tenue à deux mains. Jardin musical, pont fleuri et rubans de notes, ballet des vents, puis concert d'aurores. | Choupinette, Étincelante, Féerique, Galactastique |
| Ninachou | Peau dorée, yeux ambre, cheveux bleu nuit en deux chignons, tenue ninja indigo/lilas et foulard rose ; pas feutré sur un lotus, pirouette de rubans, bond entre les toits au clair de lune, puis saut légendaire dans une éclipse scintillante. | Pailletée, Étincelante, Royalissime, Mythique |
| Baskétoile | Peau brune, yeux noisette, queue bouclée haute et bandeau rose, tenue de basket lilas/rose, baskets dorées et ballon orange ; premier rebond, dribble sur les nuages, dunk au-dessus des arcs-en-ciel, puis panier cosmique. | Choupinette, Féerique, Royalissime, WOUAH ULTIME ! |

La sauvegarde reste en v3. Les compteurs des trois familles s'ajoutent à zéro,
sans remplacer le compagnon choisi ni les cartes gagnées dans les lots précédents.

## Limites

La progression reste locale à l'appareil. L'app ne dispose pas encore de service
worker pour garantir le premier chargement des illustrations sans connexion.
Ce lot ajoute les cartes aux parcours existants ; il ne modifie pas le moteur
de questions ni les gains d'étoiles.
