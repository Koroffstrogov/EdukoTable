# EdukoTable — UI/UX mobile

## Direction

L’application doit être enfantine, claire, non genrée, et utilisable sur téléphone.

Style :

- fond clair ;
- cartes arrondies ;
- boutons larges ;
- icônes simples ;
- animations courtes ;
- mascotte Eduko ;
- couleurs positives mais pas agressives.

## Écrans MVP

### Accueil

```txt
EdukoTable

[ Mission rapide ]
[ Entraînement ciblé ]

Aujourd’hui :
⭐ 18 étoiles

[ Album ]
[ Progression ]
```

### Choix des tables

```txt
Je révise quelles tables ?

[ Table 2 ] [ Table 3 ] [ Table 4 ]
[ Table 5 ] [ Table 6 ] [ Table 7 ]
[ Table 8 ] [ Table 9 ] [ Table 10 ]

Groupes :
[ 2 à 5 ] [ 2 à 6 ] [ 2 à 10 ]

Sélection :
[2] [3] [4] [5] [6] [7] [8] [9] [10]

65 opérations possibles

[ Commencer ]
```

Règles :

- gros boutons ;
- état sélectionné très visible ;
- éviter les sliders ;
- la sélection doit être compréhensible sans explication parentale.

### Question

```txt
Question 4 / 10

Combien font ?

      7 × 8

[ 54 ] [ 56 ]
[ 63 ] [ 48 ]

⭐ ⭐ ⭐ ▢ ▢ ▢ ▢ ▢ ▢ ▢
```

Règles :

- multiplication très lisible ;
- propositions en grille 2x2 ;
- zone de clic haute ;
- pas de scroll pendant une question.

### Feedback

Bonne réponse :

```txt
Bravo !
7 × 8 = 56
+1 étoile
```

Erreur :

```txt
Presque !
7 × 8 = 56
On la reverra bientôt.
```

Le feedback doit durer juste assez pour être compris. Ne pas forcer de longues animations.

### Résumé de session

```txt
Mission terminée

8 / 10 réussies

Tu gagnes :
⭐ 11 étoiles
🎁 1 sticker

À revoir :
7 × 8
8 × 7

[ Rejouer ]
[ Voir mon sticker ]
[ Accueil ]
```

### Album

Afficher collections, stickers et cartes de défi.

État actuel :

```txt
Forêt Eduko        7 / 10
[sticker] [sticker] [verrouillé] ...

Espace Eduko       4 / 10
[sticker] [verrouillé] [verrouillé] ...
```

Règles UI :

- séparer clairement les collections ;
- afficher le compteur par collection ;
- mettre en valeur le dernier sticker obtenu ;
- garder les stickers verrouillés attractifs mais lisibles ;
- utiliser des visuels CSS locaux, avec animation Lottie locale seulement pour certains stickers ;
- afficher un fallback statique si les animations sont désactivées ou indisponibles.

La collection « La Bande des Six » apparaît dans l’album avec six cartes
verticales au format 3:4, disposées en deux colonnes sur mobile. Une carte
verrouillée montre sa silhouette, son objectif et la progression courante ; la
prochaine carte est légèrement mise en valeur. Une carte débloquée affiche son
personnage, sa rareté et une phrase de progression.

### Progression

Écran plutôt parent.

```txt
Progression

Table 2 : 92 %
Table 3 : 84 %
Table 4 : 71 %
Table 5 : 88 %
Table 6 : 58 %

À revoir :
6 × 7 : 40 %
7 × 8 : 50 %

[ Réinitialiser les résultats ]
[ Recommencer toute l’aventure ]
```

## Animations

Animations MVP :

```txt
answer-correct-pop
answer-wrong-shake-light
star-fly-to-counter
sticker-unlock
badge-unlock
session-complete-confetti
mascot-happy
mascot-encouraging
```

État actuel :

- `lottie-react` affiche les animations locales via `EdukoAnimation` ;
- le registre local est dans `src/assets/animations/registry.ts` ;
- les IDs d’animation produit sont définis dans `src/domain/animations.ts` ;
- la mascotte et les stickers doivent toujours avoir un fallback statique visible.

Durées :

- feedback bouton : 150–250 ms ;
- étoile : 500–900 ms ;
- sticker : 800–1200 ms ;
- confetti : 800–1500 ms.

Ne pas bloquer l’enfant inutilement.

## Accessibilité

- Boutons ≥ 44px de hauteur.
- Contraste suffisant.
- `aria-live` pour les messages de feedback.
- Ne pas communiquer uniquement par couleur.
- Respecter `prefers-reduced-motion`.
- Prévoir un réglage interne `animationsEnabled`.

## Sons

État actuel :

- sons synthétisés localement avec Web Audio ;
- désactivés par défaut et activables explicitement ;
- bonne réponse, encouragement doux, fin de mission et sticker débloqué ;
- jamais indispensables et toujours doublés par un feedback visuel ou textuel ;
- aucun son d’erreur agressif ;
- initialisation audio seulement après une interaction utilisateur pour iOS.

## Responsive

Priorité :

- iPhone compact ;
- iPhone standard ;
- Android standard ;
- tablette en bonus.

Ne pas supposer un grand écran.

### Défi 6 choix

- accès séparé depuis l’accueil ;
- sélection des tables identique aux autres modes ;
- réponses en grille 2 × 3 ;
- boutons compacts mais toujours supérieurs à 44 px ;
- après une session complète, révéler une nouvelle carte de « La Bande des Six »
  lorsqu’un jalon est atteint ;
- révélation courte, compréhensible et désactivable avec les animations réduites ;
- aucun scroll nécessaire pendant une question sur un écran 320 × 568 ;
- aucun timer et aucune pénalité supplémentaire.

## Ton éditorial

Messages courts :

- “Bravo !”
- “Presque !”
- “On la reverra bientôt.”
- “Mission terminée.”
- “Tu gagnes un sticker.”

Éviter :

- “Échec”
- “Mauvais”
- “Tu as perdu”
- “Raté”

## Album des Fabuleuses

La direction féérique rose/lilas des cartes a été choisie avec l'utilisateur à
partir de Ronronova, Impératrice des étoiles. L'interface de révision conserve
sa charte et ses boutons existants.

L'album affiche d'abord les quinze familles illustrées en cinq rangées de trois,
le choix de compagnon,
puis ses quatre évolutions. Chaque carte est ouvrable dans un dialogue, avec
son image entière, sa rareté, son pouvoir et un petit secret. Une carte non
possédée est explicitement un aperçu ; la regarder ne la débloque pas.

Les objectifs sont visibles dans la fiche et sous la grille. Un encart sur
l'accueil rappelle le compagnon choisi et les missions restantes. Le résumé
célèbre la carte gagnée et propose un accès direct à l'album.

L'animation de révélation dure 800 ms et ne bloque aucun bouton. Le réglage
d'animations et `prefers-reduced-motion` la désactivent. Le dialogue se ferme
avec Fermer ou Échap, conserve un bouton de fermeture accessible en défilant
et rend le focus à la carte d'origine, y compris sur Safari.
