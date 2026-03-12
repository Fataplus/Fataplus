# Atomic Design - Construire Brique par Brique

**Module:** Jour 3 - UI Design & Atomic Design
**Slug:** atomic-design-intro

---

# Atomic Design - Construire Brique par Brique

## Introduction

**ATOM** = Atome = La plus petite partie de la matière
**ATOMIC DESIGN** = Construire des interfaces comme la nature construit toute chose

Imagine que tu regardes une maison de très près. Qu'est-ce que tu vois ? Des briques ! Chaque brique est petite, mais ensemble elles forment quelque chose de grand. En design UI, c'est pareil : les **atomes** sont nos petites briques.

### Analogie Madagascar 🇲🇬

Pense à un **plateau de vary (riz) au marché** :

1. Un grain de riz = Atome (le plus petit élément)
2. Une poignée de riz = Molécule (groupe d'atomes)
3. Un bol de riz = Organisme (section complète)
4. Une table avec plusieurs bols = Template (structure)
5. Tout le marché = Page (le tout !)

C'est la méthodologie créée par **Brad Frost** pour concevoir des interfaces de manière modulaire et organisée.

## Pourquoi Atomic Design?

### Le problème du design traditionnel

Avant, on concevait des pages entières, et c'était :
- Difficile à maintenir
- Incohérent d'une page à l'autre
- Long à créer chaque fois
- Complexe pour les équipes

### La solution Atomic Design

Avec Atomic Design, on :
- Crée des **composants réutilisables**
- Garantit la **cohérence** partout
- Facilite la **maintenance**
- Améliore la **collaboration** designer/dev

### Analogie de la Maison

```
Briques (Atomes)
    ↓
Mur (Molécule)
    ↓
Pièce (Organisme)
    ↓
Plan de la maison (Template)
    ↓
Maison complète (Page)
```

## Les 5 Niveaux d'Atomic Design

### Niveau 1 : ATOMES ⚛️

**Définition :** Les éléments les plus simples, indivisibles.

**Exemples :**
- Un bouton
- Un champ de texte (input)
- Une étiquette (label)
- Une icône
- Un titre (heading)
- Un paragraphe

**Caractéristiques :**
- Ne peuvent pas être divisés davantage
- Ont leur propre style
- Sont utilisés partout

**Analogie Madagascar :** Un grain de riz, une brique, une vis

```
Exemples d'atomes :
┌─────────┐  ┌───────────────┐  ┌─────────┐
│ Bouton  │  │ ___________   │  │   🔍    │
│         │  │ Input texte   │  │ Icône   │
└─────────┘  └───────────────┘  └─────────┘
```

### Niveau 2 : MOLÉCULES 🧪

**Définition :** Groupes d'atomes qui fonctionnent ensemble.

**Exemples :**
- Barre de recherche = Input + Bouton + Icône
- Champ de formulaire = Label + Input + Message d'erreur
- Carte de produit = Image + Titre + Prix
- Navigation item = Icône + Texte

**Caractéristiques :**
- Combinent 2+ atomes
- Ont une fonction spécifique
- Sont réutilisables

**Analogie Madagascar :** Une poignée de riz, un mur de briques, une étagère assemblée

```
Exemple de molécule (Barre de recherche) :
┌─────────────────────────────────────────┐
│  🔍  │ Tapez votre recherche... │ │
└─────────────────────────────────────────┘
   Icône + Input + Bouton = Molécule
```

### Niveau 3 : ORGANISMES 🦠

**Définition :** Sections complètes composées de molécules et d'atomes.

**Exemples :**
- Header du site (logo + navigation + bouton connexion)
- Carte de produit complète (image + infos + boutons)
- Formulaire d'inscription (plusieurs champs)
- Footer (liens + réseaux sociaux + copyright)

**Caractéristiques :**
- Sections indépendantes
- Ont un sens complet
- Peuvent être déplacées entre pages

**Analogie Madagascar :** Un bol de riz complet, une pièce de maison, un étal au marché

```
Exemple d'organisme (Header) :
┌─────────────────────────────────────────────────────────────┐
│ [Logo]     Accueil  Produits  Contact     [Connexion]       │
└─────────────────────────────────────────────────────────────┘
   Logo + Navigation (molécules) + Bouton (atome) = Organisme
```

### Niveau 4 : TEMPLATES 📄

**Définition :** Structure de page qui organise les organismes.

**Exemples :**
- Template page d'accueil
- Template page produit
- Template page article
- Template page contact

**Caractéristiques :**
- Montrent la disposition générale
- Sans contenu réel (lorem ipsum)
- Réutilisables pour plusieurs pages

**Analogie Madagascar :** Le plan d'une maison, la disposition d'un marché

```
Exemple de template (Page d'accueil) :
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
├─────────────────────────────────────────────────┤
│                   HERO                           │
├─────────────────────────────────────────────────┤
│              CARACTÉRISTIQUES                   │
├─────────────────────────────────────────────────┤
│               TÉMOIGNAGES                       │
├────────────────────────────────────────---------┤
│                   FOOTER                         │
└─────────────────────────────────────────────────┘
```

### Niveau 5 : PAGES 📱

**Définition :** Templates avec le contenu réel.

**Exemples :**
- Page d'accueil avec vrais textes et images
- Page produit "Tomates Bio de Ravo"
- Page article "Comment cultiver le riz"

**Caractéristiques :**
- Ce que l'utilisateur voit vraiment
- Contenu réel et final
- Variations possibles du template

**Analogie Madagascar :** La maison construite et meublée, le marché en pleine activité

```
Exemple de page :
┌─────────────────────────────────────────────────┐
│ [FATAPLUS]     Accueil  Produits  Contact       │
├─────────────────────────────────────────────────┤
│        🍅 Tomates Bio de Ravo                    │
│        Frais d'Antsirabe                        │
│        [Commander maintenant]                   │
├─────────────────────────────────────────────────┤
│   ★★★★★ "Délicieux !" - Mamy                    │
│   ★★★★☆ "Très frais" - Tiana                   │
├─────────────────────────────────────────────────┤
│ FATAPLUS © 2026  Contact | Aide                 │
└─────────────────────────────────────────────────┘
```

## Résumé Visuel des 5 Niveaux

```
┌────────────────────────────────────────────────────────────────┐
│                    ATOMIC DESIGN EN RÉSUMÉ                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚛️ ATOMES (Éléments simples)                                  │
│     • Bouton, Input, Icône, Titre                              │
│     • Ex : Un grain de riz                                     │
│                                                                 │
│  🧪 MOLÉCULES (Groupes d'atomes)                               │
│     • Barre de recherche, Champ de formulaire                  │
│     • Ex : Une poignée de riz                                  │
│                                                                 │
│  🦠 ORGANISMES (Sections complètes)                            │
│     • Header, Footer, Carte de produit                         │
│     • Ex : Un bol de riz                                       │
│                                                                 │
│  📄 TEMPLATES (Structure de page)                              │
│     • Disposition générale, Layout                             │
│     • Ex : Le plan de la table                                 │
│                                                                 │
│  📱 PAGES (Contenu réel)                                       │
│     • Page finale avec vrais textes et images                  │
│     • Ex : Le marché complet                                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Les Avantages d'Atomic Design

### 1. Réutilisabilité ♻️

**Un bouton créé une fois = utilisé 100 fois**

- Gagne du temps
- Réduit les erreurs
- Facilite les mises à jour

### 2. Cohérence 🎯

**Tous les boutons se ressemblent**

- Expérience uniforme
- Marque cohérente
- Professionnalisme

### 3. Maintenance 🛠️

**Changer 1 atome = change partout**

- Mise à jour facile
- Moins de bugs
- Évolutions rapides

### 4. Collaboration 🤝

**Designers et devs parlent le même langage**

- "Le bouton primaire" = tout le monde comprend
- Documentation claire
- Communication efficace

## Exemple Pratique : L'app MVola

### Atomes de MVola

```
┌──────────────────────────────────────────────────────────────┐
│  ATOMES MVola                                                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  🔵 Bouton orange (Send Money)                               │
│  📱 Input numéro téléphone                                   │
│  💰 Input montant                                             │
│  👤 Avatar utilisateur                                        │
│  📊 Icône transaction                                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Molécules de MVola

```
┌──────────────────────────────────────────────────────────────┐
│  MOLÉCULES MVola                                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │ [Avatar] Nom du contact    [Montant]    │ = Contact Card  │
│  └─────────────────────────────────────────┘                 │
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │ [Numéro]                 [Icone]        │ = Input Field   │
│  └─────────────────────────────────────────┘                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Organisme de MVola

```
┌──────────────────────────────────────────────────────────────┐
│  ORGANISME : Formulaire d'envoi                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │ Destinataire                            │                 │
│  │ [________________] [🔍]                 │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │ Montant                                 │                 │
│  │ [________________] Ar                    │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │          [Envoyer l'argent]             │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Exercice 1 : Décomposition Atomic (30 min)

### Objectif
Décomposer l'écran d'accueil de **Facebook** en utilisant Atomic Design.

### Instructions

1. Ouvre Facebook sur ton téléphone
2. Prends une capture d'écran de l'accueil
3. Identifie et liste :

   **Atomes (minimum 5) :**
   - Ex : Bouton Like, Avatar, Icône commentaire...

   **Molécules (minimum 3) :**
   - Ex : Barre de recherche, Post header, Zone de réactions...

   **Organismes (minimum 2) :**
   - Ex : Un post complet, Le header Facebook...

4. Dessine un schéma montrant la hiérarchie

### Format de livraison
- 1 feuille A4 avec le schéma
- Légende avec les différents niveaux
- Code couleur : Atomes = Bleu, Molécules = Vert, Organismes = Orange

## Exercice 2 : Créer tes propres Atomes (20 min)

### Objectif
Créer 5 atomes pour une app de **livraison de repas à Madagascar**.

### L'app "Tikoto"
Une app pour commander des repas malgaches (vary, romazava, koba...)

### Ta mission

Dessiner sur papier ces 5 atomes :

1. **Bouton primaire** - "Commander maintenant"
2. **Bouton secondaire** - "Voir le menu"
3. **Input** - Pour entrer l'adresse de livraison
4. **Badge** - Pour montrer le prix (ex: 5000 Ar)
5. **Icône** - Représentant un plat malgache

### Contraintes
- Style cohérent (même épaisseur de trait)
- Formes simples
- Taille appropriée (ni trop grand ni trop petit)
- Annoter chaque atome avec son nom et usage

## Comment organiser son Design System

### Structure de fichiers recommandée

```
design-system/
├── atoms/
│   ├── buttons/
│   │   ├── primary-button
│   │   ├── secondary-button
│   │   └── icon-button
│   ├── inputs/
│   │   ├── text-input
│   │   ├── select-input
│   │   └── checkbox
│   └── typography/
│       ├── heading
│       └── paragraph
├── molecules/
│   ├── search-bar/
│   ├── form-field/
│   └── card/
├── organisms/
│   ├── header/
│   ├── footer/
│   └── product-card/
├── templates/
│   ├── home-page/
│   └── product-page/
└── pages/
    ├── home/
    └── product/
```

### Nommer ses composants

Utilise des noms clairs et descriptifs :

- ✅ `primary-button` 
- ❌ `button1`

- ✅ `product-card`
- ❌ `card-thing`

- ✅ `search-input`
- ❌ `input-thingy`

## Les Erreurs à Éviter

### ❌ Erreur 1 : Créer trop d'atomes différents

**Problème :** 15 boutons différents = confusion
**Solution :** 2-3 variations maximum (primaire, secondaire, tertiaire)

### ❌ Erreur 2 : Sauter des niveaux

**Problème :** Passer directement des atomes aux organismes
**Solution :** Chaque niveau a son importance, respecter la hiérarchie

### ❌ Erreur 3 : Ne pas documenter

**Problème :** Personne ne comprend comment utiliser les composants
**Solution :** Documenter chaque composant avec : nom, usage, propriétés, exemples

### ❌ Erreur 4 : Ignorer la réutilisabilité

**Problème :** Créer des composants trop spécifiques
**Solution :** Se demander "Est-ce que je peux réutiliser ça ailleurs ?"

## Récapitulatif de la Leçon

### Atomic Design en 5 points

```
┌────────────────────────────────────────────────────────┐
│               ATOMIC DESIGN EN RÉSUMÉ                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  1️⃣ ATOMES     → Éléments simples, indivisibles       │
│  2️⃣ MOLÉCULES  → Groupes d'atomes fonctionnels        │
│  3️⃣ ORGANISMES → Sections complètes                   │
│  4️⃣ TEMPLATES  → Structure de page                    │
│  5️⃣ PAGES      → Contenu réel et final                │
│                                                         │
├────────────────────────────────────────────────────────┤
│  AVANTAGES :                                            │
│  • Réutilisabilité    • Cohérence                      │
│  • Maintenance        • Collaboration                  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Phrases à retenir

- *"Un atome créé une fois = utilisé partout"*
- *"La cohérence fait le professionnalisme"*
- *"Pense petit pour construire grand"*

## 📝 Quiz: Quiz : Atomic Design

**1.** Quels sont les 5 niveaux d'Atomic Design (du plus petit au plus grand) ?

   ⬜ Pages, Templates, Organismes, Molécules, Atomes
   ✅ Atomes, Molécules, Organismes, Templates, Pages
   ⬜ Molécules, Atomes, Pages, Templates, Organismes
   ⬜ Templates, Atomes, Pages, Molécules, Organismes

*Les 5 niveaux sont : Atomes (plus petit) → Molécules → Organismes → Templates → Pages (plus grand).*

**2.** Qu'est-ce qu'un atome en Atomic Design ?

   ⬜ Une page complète
   ⬜ Un groupe d'éléments
   ✅ L'élément le plus simple et indivisible
   ⬜ Une section de page

*Un atome est l'élément le plus simple, qui ne peut pas être divisé davantage (ex: un bouton, une icône).*

**3.** Quel avantage principal offre la réutilisabilité d'Atomic Design ?

   ⬜ Plus de couleurs
   ✅ Gagner du temps en créant une fois pour toutes
   ⬜ Plus de pages
   ⬜ Moins de bugs

*La réutilisabilité permet de créer un composant une seule fois et de l'utiliser partout, ce qui fait gagner beaucoup de temps.*

**4.** Dans MVola, qu'est-ce qu'un 'organisme' ?

   ⬜ Un bouton orange
   ✅ Le formulaire d'envoi complet
   ⬜ Une icône de transaction
   ⬜ Un input de numéro

*Le formulaire d'envoi complet (avec destinataire, montant, bouton) est un organisme car c'est une section complète composée de molécules et d'atomes.*

**5.** Pourquoi est-il important de documenter ses composants ?

   ⬜ Pour faire joli
   ✅ Pour que tout le monde puisse les comprendre et utiliser
   ⬜ C'est obligatoire
   ⬜ Pour avoir plus de fichiers

*La documentation permet à toute l'équipe de comprendre comment utiliser chaque composant correctement.*

## Devoirs pour demain

1. **Choisir** une app que tu utilises souvent (WhatsApp, Instagram, Spotify...)
2. **Décomposer** l'écran d'accueil en atomes, molécules, organismes
3. **Dessiner** un schéma hiérarchique
4. **Créer** 3 atomes personnalisés pour cette app

**Format** : 2 pages A4
- Page 1 : Schéma de décomposition
- Page 2 : Tes 3 atomes dessinés

**Durée estimée** : 40 minutes

