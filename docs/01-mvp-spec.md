# EdukoTable — spécification MVP

## Objectif du MVP

Créer une PWA utilisable immédiatement pour réviser les tables de multiplication avec :

- sélection enfant-friendly des tables ;
- sessions de 10 questions ;
- 4 propositions ;
- moteur aléatoire et moteur entraînement ciblé ;
- suivi simple par opération ;
- système de récompenses ;
- reset des résultats ;
- déploiement Vercel.

## Fonctionnalités MVP

### 1. Accueil

L’accueil affiche :

- le nom EdukoTable ;
- les actions principales :
  - Mission rapide ;
  - Entraînement ciblé ;
  - Album ;
  - Progression / réglages ;
- un résumé simple du jour :
  - étoiles gagnées ;
  - sticker éventuellement débloqué ;
  - mission du jour si implémentée.

### 2. Choix des tables

L’enfant peut choisir :

- une table précise ;
- une plage prédéfinie ;
- une sélection personnalisée.

Interface recommandée :

```txt
Je révise quelles tables ?

Choix rapide :
[ Table 2 ] [ Table 3 ] [ Table 4 ]
[ Table 5 ] [ Table 6 ] [ Table 7 ]
[ Table 8 ] [ Table 9 ] [ Table 10 ]

Groupes :
[ 2 à 5 ] [ 2 à 6 ] [ 2 à 10 ]

Sélection personnalisée :
[2] [3] [4] [5] [6] [7] [8] [9] [10]

[ Commencer ]
```

Règle importante :

```txt
Table 6 sélectionnée = opérations où 6 apparaît à gauche OU à droite.
```

Donc :

- inclure `6 × 7` ;
- inclure `7 × 6`;
- exclure `7 × 8`.

### 3. Session de questions

Session par défaut : 10 questions.

Chaque question affiche :

- progression : `Question 4 / 10` ;
- multiplication : `7 × 8` ;
- 4 réponses ;
- jauge ou compteur d’étoiles de session.

Pas de clavier. Pas de champ de texte.

### 4. Feedback immédiat

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

Après une réponse, mettre à jour les stats localement.

### 5. Résumé de session

Afficher :

- score ;
- étoiles gagnées ;
- sticker/badge débloqué ;
- opérations à revoir ;
- actions :
  - rejouer ;
  - voir mon sticker ;
  - accueil.

Exemple :

```txt
Mission terminée

8 / 10 réussies

Tu gagnes :
⭐ 11 étoiles
🎁 1 sticker

À revoir :
7 × 8
8 × 7
```

### 6. Album

Afficher les stickers débloqués et ceux verrouillés.

État actuel :

- catalogue local de 50 stickers ;
- collections Forêt Eduko, Espace Eduko, Océan Eduko, Machines rigolotes et Créatures amies ;
- stickers verrouillés visibles mais clairement distingués ;
- stickers débloqués colorés et lisibles ;
- quelques stickers rares ou épiques peuvent utiliser une animation locale avec fallback statique.

### 7. Progression / réglages

Afficher côté parent :

- taux moyen par table ;
- opérations les plus difficiles ;
- boutons de reset.

Actions :

- réinitialiser les résultats ;
- recommencer toute l’aventure.

## Modes MVP

### Mission rapide

Tirage aléatoire dans les tables sélectionnées.

Contraintes :

- éviter répétition immédiate ;
- éviter ensembles de propositions identiques ;
- éviter séquences monotones.

### Entraînement ciblé

Tirage pondéré.

Priorité aux opérations :

- jamais tentées ;
- peu tentées ;
- taux de réussite faible ;
- ratées récemment.

### Mes difficultés

Optionnel en MVP si le temps manque. Peut être une version de l’entraînement ciblé filtrée sur les opérations avec taux < 80 % et au moins 3 tentatives.

## Critères d’acceptation

- L’application démarre sur mobile.
- On peut choisir les tables.
- On peut faire une session de 10 questions.
- Les réponses sont toujours 4 propositions uniques.
- La bonne réponse est toujours présente.
- La même multiplication n’apparaît pas deux fois de suite.
- Les mêmes 4 propositions ne se répètent pas d’affilée.
- Les stats par opération sont enregistrées.
- Le mode entraînement favorise les difficultés.
- Une récompense est donnée à la fin d’une session.
- Une mission terminée débloque un sticker non possédé tant qu’un sticker de session reste disponible.
- Les résultats peuvent être réinitialisés sans effacer les récompenses.
- L’aventure complète peut être réinitialisée avec confirmation.
- `npm run build` fonctionne.
