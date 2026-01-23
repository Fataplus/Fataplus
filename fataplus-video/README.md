# Fataplus Video - Vidéo Promotionnelle Remotion

Projets vidéos promotionnels pour **Fataplus** - Startup agritech malgache.

## 📹 Vidéos Disponibles

### FataplusPromo (6 secondes)
Vidéo courte et dynamique présentant l'essentiel de Fataplus.
- **Format**: 1920x1080 (Horizontal)
- **Durée**: 6 secondes
- **Scènes**: Logo → Problèmes → Solutions → Stats → Contact

### FataplusPromoExtended (20 secondes)
Vidéo complète avec tous les détails du projet.
- **Format**: 1920x1080 (Horizontal)
- **Durée**: 20 secondes
- **Scènes**: Logo → Histoire → Problèmes → Solutions → ODD → Stats → Contact

### FataplusVertical (12 secondes)
Format vertical pour les réseaux sociaux.
- **Format**: 1080x1920 (Vertical)
- **Durée**: 12 secondes
- **Plateformes**: TikTok, Instagram Reels, YouTube Shorts

## 🚀 Installation

```bash
cd fataplus-video
npm install
```

## 📬 Commandes

### Démarrer le Studio Remotion
```bash
npm start
```

### Rendre une vidéo en MP4
```bash
npm run build
```

Pour rendre une vidéo spécifique :
```bash
npx remotion render FataplusPromo out/fataplus-promo.mp4
npx remotion render FataplusPromoExtended out/fataplus-extended.mp4
npx remotion render FataplusVertical out/fataplus-vertical.mp4
```

## 🎨 Thème

Les vidéos utilisent une palette de couleurs inspirée de l'agriculture :

- **Primary** (#2D7A3E): Vert principal
- **Secondary** (#4CAF50): Vert clair
- **Accent** (#FFC107): Jaune/or pour les CTA
- **Light** (#E8F5E9): Fond vert très clair
- **Dark** (#1B5E20): Vert foncé pour les fonds

## 📋 Contenu

Les vidéos présentent :
- **L'histoire** de Fataplus depuis 2006 avec le projet Bassin Versant Lac Alaotra
- **Les problèmes** : accès limité aux marchés, méthodes traditionnelles, manque d'information
- **Les solutions** : Fiofanana (formations), Marketplace, Communauté
- **Les Objectifs de Développement Durable** : ODD 2, 8, 9, 12, 13
- **Les statistiques** d'impact en 3 mois de Go-To-Market
- **Contact** : fata.plus, contact@fata.plus, +261 34 20 472 13

## 🛠️ Structure du Projet

```
fataplus-video/
├── src/
│   ├── components/
│   │   ├── animations.ts       # Fonctions d'animation réutilisables
│   │   ├── Logo.tsx            # Composant Logo
│   │   ├── ProblemCard.tsx     # Carte de problème
│   │   ├── SolutionItem.tsx    # Élément de solution
│   │   ├── StatCounter.tsx     # Compteur animé
│   │   └── ContactCard.tsx     # Carte de contact/CTA
│   └── compositions/
│       ├── FataplusPromo.tsx           # Vidéo courte 6s
│       ├── FataplusPromoExtended.tsx   # Vidéo complète 20s
│       └── FataplusVertical.tsx        # Vidéo verticale 12s
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📝 Animer avec Remotion

Les animations utilisent `useCurrentFrame()` et sont basées sur les principes suivants :

- **Pas de CSS animations** - Tout est géré par JavaScript avec `interpolate()` et `spring()`
- **Temps en secondes** - Multiplié par fps pour les frames
- **Springs** - Pour les animations naturelles
- **Interpolation** - Pour les transitions fluides

## 📞 Contact Fataplus

- 🌐 **Site**: fata.plus
- 📧 **Email**: contact@fata.plus
- 📱 **Téléphone**: +261 34 20 472 13

---

**Connectez, Cultivez, Prospérez** 🌱
