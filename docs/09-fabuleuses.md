# Les Fabuleuses d'Eduko — Le Grand Bal des Merveilles

## Lot livré

Soixante cartes illustrées : quinze familles de quatre évolutions, livrées en
cinq lots de douze cartes. Le catalogue de 100
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
| Poussinelle | Pousse-Pouce | Liane malicieuse | Duchesse chlorophylle | Floraison cosmique |
| Loutrelune | Galipette de rosée | Perle de lune | Gardienne des brumes | Oracle des marées |
| Shampouff | Bulle-Malice | Mousse futée | Prince du démêlage | Génie des bulles |
| Fluoribelle | Trait-Malice | Arc-en-Surligne | Marquise des couleurs | Aurore fluo |
| Sacapouic | Mini-Diablotin | Zip infernal | Duc des bêtises | Seigneur du bazar |
| Uranounet 235 | Noyau-Chou | Pirouette quantique | Prince des orbitales | Majesté atomique |

Les jalons par compagnon sont 1, 2, 4, 7 missions de dix questions terminées.
Il faut donc 105 missions pour obtenir les 60 cartes, en changeant de compagnon
après chaque famille complète. Les erreurs n'affectent pas les évolutions.

Les cartes ont une rareté, un pouvoir et un secret humoristique. Leur numéro
001–012, 021–028, 041–048, 061–072 ou 081–100 réserve leur place dans la
future série de 100. Le compteur de l'album affiche les 60 cartes jouables.

## Direction artistique et assets

Référence validée : deuxième proposition, le chat Ronronova, Impératrice des étoiles.
Chat lavande aux grands yeux bleu-violet, ailes papillon translucides, cadre opale
et or, château céleste, cape rose et reflets holographiques. Cette image est reprise
pour `ronronova-4.webp`. Les 59 autres images ont été créées individuellement
avec l'outil natif Image Gen en utilisant cette référence et le stade précédent.
Les titres font partie des illustrations ; les mêmes informations sont proposées
en texte accessible dans l'interface.

Assets : `public/cards/fabuleuses/<famille>-<stade>.webp`, 768 × 1024 pixels,
compression WebP qualité 90. Pas de génération
à l'exécution. La grille charge les images paresseusement, la grande fiche et
les révélations immédiatement. Aucun ajout de dépendance.

Le sélecteur des quinze familles utilise des miniatures WebP 120 × 160 dans
`public/cards/fabuleuses/thumbnails/` pour éviter de charger quinze grandes images
avant même de consulter leurs cartes. Les illustrations ouvertes restent en 768 × 1024.

## Extension envisagée à 100

Vingt-cinq familles de quatre évolutions, réparties dans neuf univers.
Les noms ci-dessous constituent une proposition éditoriale, sans assets ni
cartes verrouillées artificiellement dans ce lot.

| Univers | Familles envisagées |
| --- | --- |
| Jardin des Fées Farceuses | Pétalipop, Poussinelle, Violette Pirouette, Mimosa Malicieuse |
| Royaume des Nuages Sucrés | Lunabelle, Pomponnette, Meringuette, Pluminette, Madame Flocon |
| Archipel des Sirènes Pétillantes | Coralie Glouglou, Loutrelune, Médusette, Nacrelune, Bulle-Bisou |
| Confiserie des Dragonnes | Pralinette, Caramélune, Chouquette Flambette |
| Palais des Bulles Malicieuses | Shampouff |
| Atelier des Couleurs Impossibles | Fluoribelle |
| Manoir des Cartables Farceurs | Sacapouic |
| Observatoire des Atomes Rêveurs | Uranounet 235 |
| Bal des Princesses Cosmiques | Ronronova, Flûtinelle, Ninachou, Baskétoile |

Le catalogue conserve huit raretés : Choupinette, Pailletée, Étincelante,
Féerique, Royalissime, Mythique, Galactastique et WOUAH ULTIME ! Leur répartition
sera ajustée au fil des familles. La rareté indique l'ampleur de la magie,
jamais une probabilité de tirage ni un achat nécessaire.

Avant d'ajouter les 40 autres illustrations : recueillir le retour sur les 60,
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

## Quatrième lot : plante, loutre et shampooing

Poussinelle (005–008), Loutrelune (045–048) et Shampouff (065–068)
remplacent trois propositions encore non illustrées. Shampouff ouvre le Palais
des Bulles Malicieuses : son univers est une salle de bain féérique.
Les numéros, identifiants et cartes des trois premiers lots sont conservés.

Assets : `poussinelle-1.webp` à `poussinelle-4.webp`, `loutrelune-1.webp` à
`loutrelune-4.webp`, `shampouff-1.webp` à `shampouff-4.webp`, dans
`public/cards/fabuleuses/`, plus trois miniatures des premiers stades.

Chaque illustration provient d'une génération native Image Gen individuelle.
Prompt commun : carte portrait 3:4, cadre opale/or entier, peinture féérique
scintillante, grands yeux expressifs, reflets holographiques, typographie
française intégrée. Référence de style : Ronronova stade 4 ; référence d'identité :
stade précédent. Inclure exactement EDUKOTABLE, le nom, le titre du tableau,
le numéro sur 100, la rareté et « Évolution N/4 ». Optimisation WebP 768 × 1024,
qualité 90, méthode 6 ; miniatures 120 × 160, qualité 82.

| Famille | Identité et progression visuelle | Raretés des stades 1 à 4 |
| --- | --- | --- |
| Poussinelle | Plante anthropomorphe, visage-feuille en cœur vert menthe, pétales roses, bras feuilles et racines ; pot de terre cuite, lianes-balancelles pour papillons, jardin suspendu et pot de cristal, puis floraison géante au milieu des constellations. | Choupinette, Pailletée, Féerique, Mythique |
| Loutrelune | Loutre brun-mauve et crème, yeux turquoise, moustaches, oreilles rondes, longue queue effilée et pendentif lunaire ; galet câlin, perle sur le ventre en flottant, gardienne couronnée dans les brumes, puis oracle et grande perle céleste. | Choupinette, Étincelante, Royalissime, Galactastique |
| Shampouff | Flacon lilas/opale animé avec clapet, yeux malicieux, pictogramme de mèche, bras et pieds, coiffure de mousse ; petites bulles, peigne et mousse futée, prince couronné avec sceptre, puis palais de bulles et aurores. | Pailletée, Étincelante, Royalissime, Mythique |

Le chargement d'un album v3 de neuf familles ajoute les trois compteurs à zéro.
Le compagnon choisi, les cartes gagnées et les progrès partiels sont conservés.
Les nouvelles familles utilisent les mêmes jalons 1/2/4/7, y compris après une
mission avec des erreurs. Aucun changement de schéma ni de mécanique de gain.

## Cinquième lot : papeterie et fantaisie atomique

Fluoribelle (009–012), Sacapouic (069–072) et Uranounet 235 (097–100)
remplacent trois propositions non illustrées. Leurs univers sont l'Atelier des
Couleurs Impossibles, le Manoir des Cartables Farceurs et l'Observatoire des Atomes
Rêveurs. Les numéros des cartes précédentes sont inchangés. La carte 100 est une
place dans la série prévue ; le compteur d'album reste bien à 60 cartes disponibles.

Assets : `fluoribelle-1.webp` à `fluoribelle-4.webp`, `sacapouic-1.webp` à
`sacapouic-4.webp`, `uranounet-1.webp` à `uranounet-4.webp`, dans
`public/cards/fabuleuses/`, et leurs trois miniatures dans `thumbnails/`.

Prompt commun : illustration native Image Gen individuelle, portrait 3:4, cadre
opale/or entier, grands yeux expressifs, peinture féérique et scintillements
holographiques. Reprendre Ronronova stade 4 pour le style et le stade précédent
pour l'identité. Intégrer EDUKOTABLE, le nom, le titre du tableau, le numéro sur
100, la rareté et « Évolution N/4 ». WebP 768 × 1024, qualité 90, méthode 6 ;
miniatures 120 × 160, qualité 82. Les textes sont aussi accessibles dans l'interface.

| Famille | Identité et progression visuelle | Raretés des stades 1 à 4 |
| --- | --- | --- |
| Fluoribelle | Surligneur large à pointe biseautée multicolore, corps rose/lilas translucide, bandes arc-en-ciel, capuchon arrière, petits membres ; premier trait sur cahier, toboggan de couleurs, marquise avec ponts entre livres, puis aurore sur une bibliothèque céleste. | Pailletée, Étincelante, Féerique, Galactastique |
| Sacapouic | Sac à dos prune à bretelles, poignée et poche, yeux ambre, cornes framboise, canines, ailes de chauve-souris et queue pointue ; petit diablotin, zip et tourbillon de fournitures, duc des passages magiques, puis seigneur d'un château volant de papeterie. | Choupinette, Pailletée, Royalissime, Mythique |
| Uranounet 235 | Atome personnifié : noyau perlé corail/lavande, yeux turquoise, médaillon U-235 et anneaux lumineux ; petit noyau, pirouette avec nœud papillon, couronne et anneaux royaux, puis ballet cosmique et palais de constellations. | Choupinette, Étincelante, Féerique, WOUAH ULTIME ! |

Uranounet est une représentation fantastique, pas un schéma scientifique de
l'uranium. Ses quatre évolutions restent le même personnage U-235. Sacapouic garde
une allure démoniaque identifiable mais farceuse et adaptée au public de l'app.

Le schéma reste v3. Un album de douze familles reçoit les trois nouveaux compteurs
à zéro sans perdre cartes, compagnon ou progrès. Les jalons 1/2/4/7 et les règles
de récompenses restent identiques.

## Limites

La progression reste locale à l'appareil. L'app ne dispose pas encore de service
worker pour garantir le premier chargement des illustrations sans connexion.
Ce lot ajoute les cartes aux parcours existants ; il ne modifie pas le moteur
de questions ni les gains d'étoiles.
