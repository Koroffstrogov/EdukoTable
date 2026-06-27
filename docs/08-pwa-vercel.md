# EdukoTable — PWA et Vercel

## Objectif

L’application doit être facilement installable/ouvrable sur iPhone et Android via une URL Vercel.

Le MVP peut être une PWA simple sans service worker complexe au départ, mais il doit préparer :

- manifest ;
- icônes ;
- thème ;
- responsive mobile ;
- build statique.

## Vite

Commandes attendues :

```bash
npm run dev
npm run build
npm run preview
```

Vercel doit pouvoir exécuter :

```bash
npm run build
```

et servir le dossier :

```txt
dist/
```

## Manifest

Créer ou vérifier :

```txt
public/manifest.webmanifest
```

Contenu type :

```json
{
  "name": "EdukoTable",
  "short_name": "EdukoTable",
  "description": "Réviser les tables de multiplication avec des récompenses.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6C63FF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Les couleurs peuvent être ajustées selon la charte finale.

## HTML

Vérifier dans `index.html` :

```html
<title>EdukoTable</title>
<meta name="theme-color" content="#6C63FF" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## iPhone

Ajouter au minimum :

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="EdukoTable" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

## Offline

MVP :

- l’application doit charger vite ;
- localStorage garde la progression.

Option plus tard :

- service worker ;
- cache shell ;
- stratégie offline plus complète.

Ne pas ajouter un service worker fragile dans le MVP si cela complique le build. Une PWA installable simple est préférable à un offline cassé.

## Assets

Prévoir :

```txt
public/icons/icon-192.png
public/icons/icon-512.png
```

Si les vraies icônes ne sont pas encore disponibles, créer des placeholders simples et documenter qu’ils doivent être remplacés.

## Vercel

Configuration par défaut suffisante pour Vite.

Optionnel :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

dans `vercel.json`.

## Critères d’acceptation

- `npm run build` fonctionne localement.
- Vercel détecte le projet Vite.
- L’app affiche EdukoTable.
- Le manifest est servi.
- L’app est utilisable sur largeur mobile.
- La progression persiste après rechargement.
