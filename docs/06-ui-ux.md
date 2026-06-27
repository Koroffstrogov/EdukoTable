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

Afficher collections et stickers.

MVP possible :

```txt
Forêt Eduko
[🦊] [🌳] [🍄] [ ? ] [ ? ]

Espace Eduko
[🚀] [🪐] [ ? ] [ ? ] [ ? ]
```

Prévoir que ces placeholders puissent devenir des SVG.

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

MVP facultatif.

Si sons ajoutés :

- désactivés ou activables explicitement ;
- jamais indispensables ;
- pas de son d’erreur agressif ;
- respecter les contraintes iOS sur l’audio déclenché par interaction utilisateur.

## Responsive

Priorité :

- iPhone compact ;
- iPhone standard ;
- Android standard ;
- tablette en bonus.

Ne pas supposer un grand écran.

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
