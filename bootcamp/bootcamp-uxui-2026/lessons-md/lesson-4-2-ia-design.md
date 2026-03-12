# L'IA au Service du Design

**Module:** Jour 4 - Design Systems & Outils IA
**Slug:** ia-design

---

# L'IA au Service du Design

## Qu'est-ce que l'IA pour les designers?

L'**Intelligence Artificielle** (IA) est un assistant qui peut t'aider à :
- Générer des idées
- Créer du contenu
- Accélérer ton workflow
- Automatiser des tâches répétitives

### Analogie Madagascar 🇲🇬

L'IA, c'est comme un **assistant zézé** (jeune employé) très intelligent :
- Tu lui donnes des instructions
- Il exécute rapidement
- Tu restes le chef (le designer)
- Tu valides et ajustes le résultat

## Les outils IA pour designers

### Les 3 outils principaux

```
┌─────────────────────────────────────────────────────────────┐
│                 OUTILS IA POUR DESIGNERS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤖 CLAUDE         Texte, brainstorming, UX writing        │
│  🎨 MIDJOURNEY     Génération d'images, illustrations      │
│  ✏️ FIGMA AI       Design, suggestions, variations         │
│  🖌️ ADOBE FIREFLY  Retouche, génération d'images          │
│  📝 CHATGPT        Idées, rédaction, documentation         │
│  ⚡ GALILEO AI     UI generation from prompts              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 1. Claude et ChatGPT - Tes Assistants Texte

### Pour quoi faire?

**UX Writing**
- Rédiger des microcopies (boutons, messages)
- Créer des messages d'erreur clairs
- Écrire des onboarding flows

**Brainstorming**
- Générer des idées de features
- Explorer des personas
- Créer des user stories

**Documentation**
- Rédiger des spécifications
- Créer des guidelines
- Documenter des décisions design

### Exemple de prompt efficace

❌ **Prompt vague :**
```
Écris un texte pour mon app
```

✅ **Prompt précis :**
```
Je crée une app mobile pour commander des repas 
à Madagascar. Rédige 3 messages d'erreur pour :

1. Le restaurant est fermé
2. Le livreur n'est pas disponible
3. Le paiement a échoué

Ton : Amical mais professionnel
Longueur : Maximum 10 mots par message
Langue : Français malgache (style local)
```

### Exemples de résultats

**Message 1 : Restaurant fermé**
```
"Oups ! Ce restaurant est fermé pour l'instant. 
Réessaie plus tard ou explore d'autres options !"
```

**Message 2 : Pas de livreur**
```
"Tous nos livreurs sont occupés en ce moment. 
Un petit instant, ça arrive !"
```

**Message 3 : Paiement échoué**
```
"Le paiement n'a pas fonctionné. 
Vérifie ton solde MVola et réessaie."
```

### Exercice : Générer des microcopies (15 min)

**Objectif** : Utiliser Claude ou ChatGPT pour créer du contenu.

**Contexte** :
Tu crées l'app **TikTok Mada** pour partager des vidéos.

**Tâches** :
1. Demande à l'IA de rédiger 5 messages d'onboarding
2. Demande 3 textes pour un écran vide (pas encore de vidéos)
3. Demande un message de confirmation de publication

**Prompt template** :
```
Je crée une app de partage de vidéos courte 
pour le marché malgache (comme TikTok).

[Clairement décrire ce que tu veux]

Ton : Fun, jeune, local
Langue : Français avec expressions malgaches
```

## 2. Midjourney - Génération d'Images

### Qu'est-ce que c'est?

**Midjourney** génère des images à partir de descriptions textuelles (prompts).

### Comment l'utiliser

1. Aller sur Discord → Midjourney server
2. Utiliser la commande `/imagine`
3. Écrire ton prompt
4. Choisir parmi 4 variations
5. Télécharger l'image

### Structure d'un bon prompt

```
[SUJET] + [STYLE] + [COULEURS] + [AMBIANCE] + [FORMAT]
```

**Exemple pour une app de cuisine** :
```
A warm illustration of a Malagasy family 
cooking together in a traditional kitchen, 
soft pastel colors, friendly and inviting, 
flat design style --ar 16:9
```

### Styles utiles pour le design UI

**Flat Design**
```
flat design illustration, [sujet], 
minimal, vector style, bright colors
```

**Isometric**
```
isometric illustration of [sujet], 
clean, professional, corporate colors
```

**3D**
```
3D render of [sujet], soft lighting, 
pastel colors, modern, friendly
```

**Line Art**
```
line art illustration of [sujet], 
minimal, elegant, single color
```

### Exercice : Créer une illustration (20 min)

**Objectif** : Générer une illustration pour l'app Kitapo.

**Tâche** :
1. Ouvre Midjourney (ou utilise un générateur gratuit comme Leonardo.ai)
2. Crée un prompt pour une illustration de cuisine malgache
3. Génère 4 variations
4. Choisis la meilleure
5. Télécharge l'image

**Prompt suggéré** :
```
A cozy illustration of a Malagasy kitchen 
with a woman cooking ravitoto in a clay pot, 
warm orange and green tones, flat design style, 
friendly and inviting, no text, 
square format --ar 1:1
```

## 3. Figma AI - Ton Assistant Design

### Fonctionnalités AI dans Figma

**1. Auto Layout** (Intelligent)
- Ajuste automatiquement les espacements
- Responsive design facilité

**2. Suggestions de couleurs**
- Palette harmonieuse générée
- Basée sur une couleur de départ

**3. Renommage de calques**
- Organisation automatique
- Noms cohérents

### Plugins IA recommandés

**Magician (Figma)**
- Génération de texte
- Création d'icônes
- Suggestions de design

**Remove.bg**
- Suppression de fond automatique
- Pour les photos de profil

**Unsplash**
- Images gratuites haute qualité
- Intégration directe

**Content Reel**
- Remplissage de données factices
- Noms, avatars, textes

## 4. Galileo AI - Génération d'Interfaces

### Qu'est-ce que c'est?

**Galileo AI** génère des interfaces complètes à partir de descriptions textuelles.

### Comment l'utiliser

1. Aller sur usegalileo.ai
2. Créer un compte
3. Décrire l'interface souhaitée
4. Générer et exporter vers Figma

### Exemple de prompt

```
Create a mobile app home screen for a food 
delivery app in Madagascar. Include:
- Search bar at the top
- Category filters (Malagasy food, Fast food, Drinks)
- Featured restaurants section
- Popular dishes carousel
- Bottom navigation with Home, Search, Orders, Profile

Style: Clean, modern, warm colors (red and orange)
```

### Exercice : Générer un écran (20 min)

**Objectif** : Utiliser Galileo AI pour créer un écran.

**Tâche** :
1. Va sur usegalileo.ai
2. Crée un compte (gratuit)
3. Génère l'écran d'accueil de l'app Kitapo
4. Exporte vers Figma
5. Analyse ce qui est bon et ce qui doit être amélioré

**Prompt** :
```
Mobile app home screen for a Malagasy recipe 
app called Kitapo. Include:
- Header with app name and search
- Categories (Plats, Desserts, Boissons)
- Featured recipes with photos
- Bottom navigation

Style: Warm, inviting, uses red as primary color
```

## 5. Les limites de l'IA

### Ce que l'IA ne peut PAS faire

❌ **Remplacer la créativité humaine**
- L'IA génère, tu décides
- Le designer reste le chef

❌ **Comprendre le contexte local**
- Nuances culturelles malgaches
- Expressions idiomatiques
- Sensibilités locales

❌ **Prendre des décisions design**
- Hiérarchie de l'information
- Priorisation des éléments
- Équilibre visuel

❌ **Garantir l'accessibilité**
- Contraste des couleurs
- Taille des textes
- Navigation au clavier

### Les pièges à éviter

⚠️ **Copier-coller sans réfléchir**
- Toujours valider le résultat
- Adapter au contexte

⚠️ **Utiliser des images sans vérifier**
- Droits d'auteur
- Cohérence visuelle

⚠️ **Oublier l'utilisateur final**
- L'IA ne connaît pas tes users
- Tu dois tester avec de vraies personnes

## Best Practices pour l'IA

### Les 5 commandements de l'IA en design

**1. L'IA est un assistant, pas un remplaçant**
- Tu restes le designer
- Tu prends les décisions finales

**2. Prompts précis = Meilleurs résultats**
- Détailler le contexte
- Spécifier le ton, le style, le format

**3. Toujours valider et adapter**
- Relire le texte généré
- Vérifier la cohérence
- Adapter au public cible

**4. Citer les sources**
- Mentionner l'utilisation d'IA
- Respecter les licences

**5. Tester avec de vrais utilisateurs**
- L'IA ne remplace pas les tests users
- Le feedback humain est irremplaçable

## Workflow IA recommandé

### Pour un projet de design

```
┌─────────────────────────────────────────────────────────────┐
│                 WORKFLOW AVEC IA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. BRAINSTORMING                                           │
│     Claude/ChatGPT → Générer des idées                     │
│                                                             │
│  2. UX WRITING                                              │
│     Claude → Microcopies, messages                          │
│                                                             │
│  3. VISUALS                                                 │
│     Midjourney → Illustrations, placeholders               │
│                                                             │
│  4. UI GENERATION                                           │
│     Galileo → Premiers wireframes                          │
│                                                             │
│  5. REFINEMENT                                              │
│     Toi dans Figma → Ajuster, peaufiner                    │
│                                                             │
│  6. TESTING                                                 │
│     Utilisateurs réels → Valider                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Exercice pratique complet (30 min)

### Objectif
Utiliser plusieurs outils IA pour créer une section de l'app Kitapo.

### Étape 1 : Brainstorming (5 min)
Utilise Claude ou ChatGPT pour :
```
Génère 5 idées de fonctionnalités originales 
pour une app de recettes malgaches qui la 
différencieraient des autres apps de cuisine.
```

### Étape 2 : UX Writing (5 min)
Choisis 1 idée et génère :
```
Rédige le texte pour l'écran d'onboarding 
qui présente cette fonctionnalité.
Inclus : titre, description, bouton.
```

### Étape 3 : Illustration (10 min)
Utilise Midjourney ou Leonardo.ai :
```
Génère une illustration pour cet écran 
d'onboarding, style flat design, 
couleurs chaudes (orange, rouge, vert).
```

### Étape 4 : Intégration (10 min)
- Importe l'image dans Figma
- Crée l'écran avec le texte généré
- Ajuste selon ton jugement de designer

## Récapitulatif de la leçon

### Ce que tu as appris :

```
┌─────────────────────────────────────────────────────────────┐
│                 IA POUR DESIGNERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤖 CLAUDE/CHATGPT  →  Texte, idées, documentation         │
│  🎨 MIDJOURNEY      →  Illustrations, images               │
│  ⚡ GALILEO AI      →  Génération d'interfaces             │
│  🔌 FIGMA PLUGINS   →  Automatisation, assets              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚠️ L'IA est un ASSISTANT, pas un remplaçant              │
│  ✅ Prompts PRÉCIS = Meilleurs résultats                   │
│  🧪 Toujours VALIDER et ADAPTER                             │
│  👥 TESTER avec de vrais utilisateurs                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Quiz: Quiz : IA au Service du Design

**1.** Quel outil IA est le meilleur pour générer du texte UX ?

   ⬜ Midjourney
   ✅ Claude/ChatGPT
   ⬜ Galileo AI
   ⬜ Figma

*Claude et ChatGPT sont des modèles de langage spécialisés dans la génération de texte.*

**2.** Qu'est-ce qu'un prompt efficace ?

   ⬜ Court et vague
   ⬜ Long et complexe
   ✅ Précis avec contexte et contraintes
   ⬜ Copié depuis internet

*Un bon prompt inclut le contexte, le ton, le style et les contraintes spécifiques.*

**3.** Quelle est la limite principale de l'IA en design ?

   ⬜ Elle est trop lente
   ✅ Elle ne comprend pas le contexte local
   ⬜ Elle coûte trop cher
   ⬜ Elle ne génère pas d'images

*L'IA manque de compréhension culturelle et contextuelle, surtout pour des marchés locaux comme Madagascar.*

**4.** Que faut-il TOUJOURS faire après avoir utilisé l'IA ?

   ⬜ Publier directement
   ✅ Valider et adapter le résultat
   ⬜ Générer plus de contenu
   ⬜ Supprimer les prompts

*Il faut toujours valider, relire et adapter le contenu généré par l'IA.*

**5.** Quel outil génère des interfaces complètes ?

   ⬜ ChatGPT
   ⬜ Midjourney
   ✅ Galileo AI
   ⬜ Remove.bg

*Galileo AI est spécialisé dans la génération d'interfaces UI complètes à partir de prompts.*

## Devoirs pour demain

1. **Créer un compte** sur Claude (claude.ai) ou ChatGPT
2. **Générer** 5 idées de features pour une app de ton choix
3. **Essayer** un générateur d'images (Midjourney, Leonardo.ai, ou DALL-E)
4. **Réfléchir** : Comment l'IA pourrait t'aider dans ton futur métier ?

**Durée estimée :** 30 minutes

### Ressources :
- [Claude](https://claude.ai)
- [ChatGPT](https://chat.openai.com)
- [Midjourney](https://midjourney.com)
- [Leonardo.ai](https://leonardo.ai) - Gratuit
- [Galileo AI](https://usegalileo.ai)

