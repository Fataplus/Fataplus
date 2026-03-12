# Design Systems - Le Grand Livre des Règles

**Module:** Jour 4 - Design Systems & Outils IA
**Slug:** design-systems

---

# Design Systems - Le Grand Livre des Règles

## Qu'est-ce qu'un Design System?

Un **Design System** est un ensemble de règles, composants et guidelines qui garantissent la cohérence d'un produit.

### Analogie Madagascar 🇲🇬

Un Design System, c'est comme le **code de la route** :
- Feu rouge = Stop (tout le monde s'arrête)
- Feu vert = Avance (tout le monde avance)
- Clignotant = Change de direction

Sans code de la route, ce serait le chaos !

Sans Design System, une app est **confuse et incohérente**.

## Pourquoi les Design Systems?

### Le problème sans Design System

Imagine une équipe de 5 designers :
- **Rakoto** utilise du bleu #3B82F6
- **Rasoa** utilise du bleu #2563EB
- **Faly** utilise du bleu #1D4ED8
- **Miora** utilise du bleu #60A5FA
- **Hery** utilise du bleu #1E40AF

Résultat : **5 bleus différents** ! L'app paraîtra bizarre et non professionnelle.

### La solution : Le Design System

Avec un Design System :
- **1 bleu défini** : #3B82F6
- Tout le monde l'utilise
- Cohérence garantie ✅

## Les 3 piliers d'un Design System

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM                            │
├─────────────────┬─────────────────┬─────────────────────────┤
│                 │                 │                         │
│   GUIDELINES    │   COMPOSANTS    │      DOCUMENTATION      │
│   (Règles)      │   (Éléments)    │      (Mode d'emploi)    │
│                 │                 │                         │
│  • Couleurs     │  • Boutons      │  • Comment utiliser     │
│  • Typographie  │  • Inputs       │  • Exemples             │
│  • Espacements  │  • Cards        │  • Bonnes pratiques     │
│  • Icônes       │  • Modals       │  • Code snippets        │
│                 │  • Navigation   │                         │
│                 │                 │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## 1. Les Guidelines - Les Règles Fondamentales

### A. La Palette de Couleurs

Un Design System définit **toutes les couleurs autorisées** :

**Couleurs Primaires**
```
┌────────────────────────────────────────┐
│ Primary-50   #EFF6FF  (très clair)    │
│ Primary-100  #DBEAFE                  │
│ Primary-200  #BFDBFE                  │
│ Primary-300  #93C5FD                  │
│ Primary-400  #60A5FA                  │
│ Primary-500  #3B82F6  ← BASE          │
│ Primary-600  #2563EB                  │
│ Primary-700  #1D4ED8                  │
│ Primary-800  #1E40AF                  │
│ Primary-900  #1E3A8A  (très foncé)    │
└────────────────────────────────────────┘
```

**Couleurs Sémantiques**
```
🟢 Success : #10B981 (Validation)
🔴 Error   : #EF4444 (Erreur)
🟡 Warning : #F59E0B (Attention)
🔵 Info    : #3B82F6 (Information)
```

**Couleurs Neutres**
```
⚫ Gray-900 : #111827 (Texte principal)
⚫ Gray-600 : #4B5563 (Texte secondaire)
⚫ Gray-400 : #9CA3AF (Texte désactivé)
⚪ Gray-100 : #F3F4F6 (Fond clair)
⚪ White    : #FFFFFF (Fond)
```

### B. La Typographie

**Police principale :** Inter

```
┌─────────────────────────────────────────────────────────────┐
│ HÉRARCHIE TYPOGRAPHIQUE                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  H1 - Display     48px / Bold / Line height 1.2            │
│  H2 - Title 1     36px / Bold / Line height 1.25           │
│  H3 - Title 2     28px / Semibold / Line height 1.3        │
│  H4 - Title 3     24px / Semibold / Line height 1.35       │
│  H5 - Title 4     20px / Medium / Line height 1.4          │
│  Body Large       18px / Regular / Line height 1.5         │
│  Body             16px / Regular / Line height 1.5         │
│  Body Small       14px / Regular / Line height 1.5         │
│  Caption          12px / Regular / Line height 1.4         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### C. Les Espacements (Spacing Scale)

**La règle des multiples de 4**

```
┌─────────────────────────────────────────┐
│ Token      Value     Usage              │
├─────────────────────────────────────────┤
│ space-1    4px       Micro espacement   │
│ space-2    8px       Petit espacement   │
│ space-3    12px      Espacement moyen   │
│ space-4    16px      Standard           │
│ space-5    20px      Confortable        │
│ space-6    24px      Section spacing    │
│ space-8    32px      Grand espacement   │
│ space-10   40px      Très grand         │
│ space-12   48px      Section separator  │
│ space-16   64px      Page sections      │
└─────────────────────────────────────────┘
```

### D. Les Ombres (Shadows)

Les ombres donnent de la **profondeur** aux éléments :

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  shadow-sm   0 1px 2px rgba(0,0,0,0.05)                    │
│  shadow      0 1px 3px rgba(0,0,0,0.1)                     │
│  shadow-md   0 4px 6px rgba(0,0,0,0.1)                     │
│  shadow-lg   0 10px 15px rgba(0,0,0,0.1)                   │
│  shadow-xl   0 20px 25px rgba(0,0,0,0.1)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### E. Les Coins Arrondis (Border Radius)

```
┌─────────────────────────────────────────┐
│ Token          Value    Usage          │
├─────────────────────────────────────────┤
│ radius-none    0px      Carré          │
│ radius-sm      4px      Subtil         │
│ radius         8px      Standard       │
│ radius-md      12px     Moyen          │
│ radius-lg      16px     Grand          │
│ radius-xl      24px     Très grand     │
│ radius-full    9999px   Pilule/cercle  │
└─────────────────────────────────────────┘
```

## 2. Les Composants - Les Briques Réutilisables

### Niveaux de composants

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPOSANTS                               │
├─────────────────┬─────────────────┬─────────────────────────┤
│    ATOMES       │   MOLÉCULES     │      ORGANISMES         │
│                 │                 │                         │
│  • Button       │  • Form Field   │  • Header               │
│  • Input        │  • Search Bar   │  • Footer               │
│  • Checkbox     │  • Card         │  • Navigation           │
│  • Radio        │  • Alert        │  • Product Card         │
│  • Icon         │  • Toast        │  • Hero Section         │
│  • Badge        │  • Dropdown     │  • Sidebar              │
│  • Avatar       │  • Tabs         │  • Modal                │
│  • Tag          │  • Breadcrumb   │  • Table                │
│                 │  • Pagination   │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Exemple : Le composant Button

Un Design System définit **toutes les variantes** d'un bouton :

**Variants**
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  [  Primary  ]    ← Action principale (couleur accent)    │
│  [ Secondary ]    ← Action secondaire (gris)              │
│  [  Outline  ]    ← Bouton creux (border only)            │
│  [   Ghost   ]    ← Sans fond (texte seulement)           │
│  [  Destructive ] ← Supprimer, danger (rouge)             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Sizes**
```
┌─────────────────────────────────────────┐
│  [ Small ]    32px height, 14px font   │
│  [ Medium ]   40px height, 16px font   │
│  [ Large ]    48px height, 18px font   │
└─────────────────────────────────────────┘
```

**States**
```
┌─────────────────────────────────────────┐
│  Normal   ← État par défaut            │
│  Hover    ← Souris dessus              │
│  Active   ← En train de cliquer        │
│  Focus    ← Sélectionné au clavier     │
│  Disabled ← Non cliquable              │
│  Loading  ← En cours de chargement     │
└─────────────────────────────────────────┘
```

### Exemple : Le composant Input

**Structure**
```
┌─────────────────────────────────────────────────────────────┐
│  Label                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Placeholder text                         ❌      │   │
│  └─────────────────────────────────────────────────────┘   │
│  Helper text or Error message                               │
└─────────────────────────────────────────────────────────────┘
```

**Éléments**
- **Label** : Description du champ
- **Placeholder** : Texte d'exemple
- **Icon** : Icône indicatrice (optionnel)
- **Clear button** : Effacer (optionnel)
- **Helper text** : Aide supplémentaire
- **Error message** : Message d'erreur

**States**
- Default, Hover, Focus, Error, Disabled, Read-only

## 3. La Documentation - Le Mode d'Emploi

### Pourquoi documenter?

Un Design System sans documentation = **inutile**.

Analogie Madagascar 🇲🇬 :
Un Design System, c'est comme une **recette de cuisine** :
- Les ingrédients = Les tokens (couleurs, fonts)
- La méthode = Les guidelines
- Les photos = Les exemples

Sans recette, personne ne sait comment reproduire le plat !

### Structure de la documentation

**1. Overview**
- Qu'est-ce que ce Design System ?
- Pour qui est-il ?
- Comment l'utiliser ?

**2. Foundations**
- Couleurs (avec exemples d'usage)
- Typographie (quand utiliser quoi)
- Espacements
- Icônes
- Illustrations

**3. Components**
Pour chaque composant :
- **Description** : À quoi ça sert
- **Anatomie** : Les parties du composant
- **Variants** : Les différentes versions
- **States** : Les états interactifs
- **Usage** : Quand l'utiliser
- **Do's and Don'ts** : Bonnes/mauvaises pratiques
- **Code** : Snippets HTML/CSS/React

**4. Patterns**
- Formulaires
- Navigation
- Recherche
- Onboarding
- Empty states
- Error handling

## Design Systems Célèbres

### 1. Material Design (Google)
- Utilisé par : Android, Gmail, Google Drive
- Particularité : Système complet, animations sophistiquées
- Site : material.io

### 2. Human Interface Guidelines (Apple)
- Utilisé par : iOS, macOS, watchOS
- Particularité : Très détaillé, focus sur l'expérience
- Site : developer.apple.com/design

### 3. Carbon (IBM)
- Utilisé par : Tous les produits IBM
- Particularité : Design system open source complet
- Site : carbondesignsystem.com

### 4. Polaris (Shopify)
- Utilisé par : Shopify et ses merchants
- Particularité : Focus e-commerce
- Site : polaris.shopify.com

### 5. Chakra UI
- Utilisé par : Startups tech
- Particularité : Pour React, très populaire
- Site : chakra-ui.com

## Exercice pratique : Créer un mini Design System (40 min)

### Objectif
Créer les bases d'un Design System pour l'app **Kitapo** (recettes malgaches).

### Partie 1 : Définir les couleurs

Crée ces couleurs dans Figma (Local Styles) :

**Primary (Rouge Madagascar)**
- primary-50 : #FEF2F2
- primary-100 : #FEE2E2
- primary-500 : #DC2626 ← Base
- primary-700 : #B91C1C
- primary-900 : #7F1D1D

**Neutral**
- neutral-900 : #171717
- neutral-600 : #525252
- neutral-400 : #A3A3A3
- neutral-100 : #F5F5F5
- neutral-50 : #FAFAFA

**Semantic**
- success : #16A34A
- warning : #CA8A04
- error : #DC2626
- info : #2563EB

### Partie 2 : Définir la typographie

Crée ces Text Styles dans Figma :

- **H1** : Playfair Display, Bold, 36px
- **H2** : Playfair Display, Bold, 28px
- **H3** : Inter, Semibold, 22px
- **Body** : Inter, Regular, 16px
- **Caption** : Inter, Regular, 12px

### Partie 3 : Créer les composants de base

1. **Button Primary**
   - Rectangle 120 × 44px
   - Background : primary-500
   - Border radius : 8px
   - Text : Inter Medium 14px, blanc
   - Créer comme composant (◇)

2. **Button Secondary**
   - Même structure
   - Background : neutral-100
   - Text : neutral-900

3. **Input Field**
   - Rectangle 280 × 48px
   - Background : neutral-50
   - Border : 1px neutral-400
   - Border radius : 8px
   - Placeholder : Inter Regular 14px, neutral-400

## Les Design Tokens

### Qu'est-ce qu'un token?

Un **token** est une valeur nommée et réutilisable.

Analogie : C'est comme une **variable en programmation**.

### Exemple :

❌ **Sans token** :
```
background-color: #3B82F6;
```

✅ **Avec token** :
```
background-color: var(--color-primary-500);
```

### Pourquoi?

Si demain tu veux changer le bleu :
- Sans token : Chercher #3B82F6 partout
- Avec token : Changer 1 seule valeur

### Types de tokens

**1. Global Tokens**
Valeurs brutes, sans contexte :
```
--color-blue-500: #3B82F6;
--font-size-16: 16px;
--space-16: 16px;
```

**2. Alias Tokens**
Valeurs avec contexte métier :
```
--color-primary: var(--color-blue-500);
--color-text-default: var(--color-gray-900);
--space-padding-default: var(--space-16);
```

**3. Component Tokens**
Valeurs spécifiques aux composants :
```
--button-background: var(--color-primary);
--button-border-radius: var(--radius-md);
--input-border-color: var(--color-gray-300);
```

## Récapitulatif de la leçon

### Ce que tu as appris :

```
┌─────────────────────────────────────────────────────────────┐
│                  DESIGN SYSTEM                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📚 GUIDELINES    →  Couleurs, Typo, Espacements           │
│  🧩 COMPOSANTS    →  Buttons, Inputs, Cards, etc.          │
│  📖 DOCUMENTATION →  Mode d'emploi, exemples, code         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TOKENS          →  Variables nommées et réutilisables     │
│  VARIANTS        →  Différentes versions d'un composant    │
│  STATES          →  Normal, Hover, Active, Disabled        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Les 3 règles d'or :
1. **Cohérence** = Utiliser les mêmes tokens partout
2. **Documentation** = Expliquer comment utiliser
3. **Maintenance** = Un token changé = tout mis à jour

## 📝 Quiz: Quiz : Design Systems

**1.** Quel est le rôle principal d'un Design System ?

   ⬜ Créer des animations
   ✅ Garantir la cohérence
   ⬜ Augmenter les performances
   ⬜ Réduire le temps de développement

*Le Design System assure que tous les éléments sont cohérents à travers tout le produit.*

**2.** Qu'est-ce qu'un token ?

   ⬜ Un composant réutilisable
   ✅ Une variable nommée pour une valeur
   ⬜ Un type d'animation
   ⬜ Un guide de style

*Un token est une valeur nommée (comme une variable) qui peut être réutilisée.*

**3.** Dans un Design System, combien de variantes un bouton peut-il avoir ?

   ⬜ 1 seule
   ⬜ 2-3 variantes
   ✅ Autant que nécessaire
   ⬜ Maximum 5

*Un bouton peut avoir autant de variantes que nécessaire (primary, secondary, outline, ghost, destructive, etc.).*

**4.** Que signifie la règle 60-30-10 ?

   ⬜ 60% texte, 30% images, 10% boutons
   ✅ 60% couleur principale, 30% secondaire, 10% accent
   ⬜ 60% espace, 30% contenu, 10% navigation
   ⬜ 60% clair, 30% foncé, 10% couleur

*La règle 60-30-10 définit la répartition des couleurs : principale, secondaire et d'accent.*

**5.** Quel élément n'est PAS un état de bouton ?

   ⬜ Hover
   ⬜ Focus
   ⬜ Loading
   ✅ Primary

*Primary est une variante, pas un état. Les états sont : Normal, Hover, Focus, Active, Disabled, Loading.*

## Devoirs pour demain

1. **Explorer** un Design System célèbre (Material Design ou Apple HIG)
2. **Créer** 5 composants de base dans ton fichier Figma Kitapo
3. **Noter** les couleurs principales de 3 apps que tu utilises
4. **Comparer** les styles de boutons entre Facebook et Instagram

**Durée estimée :** 40 minutes

### Ressources :
- [Material Design](https://material.io)
- [Apple HIG](https://developer.apple.com/design)
- [Figma Design Systems](https://www.figma.com/resources/design-systems/)

