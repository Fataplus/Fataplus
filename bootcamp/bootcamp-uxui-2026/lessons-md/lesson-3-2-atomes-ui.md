# Les Éléments de Base - Atomes

**Module:** Jour 3 - UI Design & Atomic Design
**Slug:** atomes-ui

---

# Les Éléments de Base - Les Atomes du Design

## Introduction

Imagine que tu construis une maison en briques. Chaque brique est petite, mais ensemble elles forment quelque chose de grand. En design UI, c'est pareil : les **atomes** sont nos petites briques.

Aujourd'hui, on va apprendre les 4 atomes les plus importants :
1. 📝 **La Typographie** - Les mots et comment ils s'affichent
2. 🎨 **Les Couleurs** - La palette qui donne vie
3. ⬜ **L'Espace** - La respiration du design
4. 🔘 **Les Boutons** - Les portes vers l'action

## 1. La Typographie - La Voix Visuelle

### Qu'est-ce que la typographie?

**TYPO** = Type (genre)
**GRAPHIE** = Écriture

La typographie, c'est **la façon dont on habille les mots**. C'est comme choisir ta tenue pour aller quelque part.

### Analogie Madagascar 🇲🇬

Pense à **Radio Madagascar**. Quand tu écoutes :
- Les nouvelles = Voix sérieuse, posée
- La musique = Voix joyeuse, dynamique
- Les annonces = Voix claire, importante

La typographie, c'est pareil ! La police de caractères donne le ton.

### Les 4 Règles d'Or de la Typographie

**Règle 1 : Maximum 2 polices par projet**

Pourquoi ? Comme on dit à Madagascar : *"Tsy ny maro no mahasoa, fa ny mety"* (Ce n'est pas la quantité qui compte, mais la justesse).

```
✅ BON : Montserrat + Open Sans
❌ MAUVAIS : Montserrat + Open Sans + Roboto + Poppins + Arial
```

**Règle 2 : Hiérarchie = Importance**

- Titre H1 = Le chef du village (le plus grand)
- Titre H2 = Les conseillers (moyen)
- Corps de texte = Les villageois (normal)

**Règle 3 : Lisibilité avant tout**

Taille minimum pour le corps : **16px**

Imagine lire un livre avec des lettres minuscules... C'est comme essayer de voir les étoiles à midi !

**Règle 4 : Contraste pour la lisibilité**

- Texte foncé sur fond clair = Facile à lire
- Texte clair sur fond foncé = Possible mais fatiguant
- Texte clair sur fond clair = Illisible !

### Les familles de polices

**1. Serif (Avec empattement)**
- Exemple : Times New Roman, Georgia
- Vibe : Classique, sérieux, traditionnel
- Usage : Journaux, livres, banques
- Analogie : Comme les vieux bâtiments coloniaux d'Antananarivo

**2. Sans-serif (Sans empattement)**
- Exemple : Arial, Roboto, Montserrat
- Vibe : Moderne, propre, amical
- Usage : Apps, sites web, startups
- Analogie : Comme les nouveaux buildings du centre-ville

**3. Display (Décorative)**
- Exemple : Pacifico, Lobster
- Vibe : Fun, créatif, unique
- Usage : Logos, titres seulement
- Analogie : Comme les enseignes colorées du marché Analakely

## Exercice 1 : Audit Typographique (20 min)

### Ton objectif
Analyser l'app **MVola** sur ton téléphone.

### Questions à répondre :
1. Combien de polices différentes vois-tu ?
2. Quelle est la taille du texte principal ?
3. Les titres sont-ils assez grands par rapport au corps ?
4. Le texte est-il facile à lire au soleil ?

### Livrable
Écris tes réponses dans ton carnet de notes.

## 2. Les Couleurs - L'Émotion Visuelle

### Pourquoi les couleurs sont importantes?

Les couleurs communiquent **avant même que tu lises un mot**. C'est comme les vêtements : tu juges quelqu'un en 3 secondes.

### La psychologie des couleurs

🔴 **ROUGE** = Attention, urgence, erreur, passion
- *Exemple :* Le bouton d'urgence, les feux rouges
- *Madagascar :* La terre laterite de nos routes

🟢 **VERT** = Succès, nature, argent, croissance
- *Exemple :* "Paiement réussi", les produits bio
- *Madagascar :* Nos rizières vertes

🔵 **BLEU** = Confiance, calme, technologie, professionnalisme
- *Exemple :* Banques, assurance, entreprises
- *Madagascar :* Le ciel bleu d'Antsirabe

🟡 **JAUNE** = Joie, attention modérée, énergie
- *Exemple :* Promotions, nouveautés
- *Madagascar :* Le soleil tropical

🟠 **ORANGE** = Créativité, enthousiasme, accessibilité
- *Exemple :* Call-to-action, offres
- *Madagascar :* Les mandarines

⚫ **NOIR** = Élégance, luxe, sérieux, mystère
- *Exemple :* Marques de luxe, mode
- *Madagascar :* L'obsidienne volcanique

⚪ **BLANC** = Pureté, espace, minimalisme, propreté
- *Exemple :* Apple, design moderne
- *Madagascar :* Les nuages

### La Règle 60-30-10

C'est LA règle pour créer des palettes harmonieuses!

```
┌─────────────────────────────────────────┐
│  ████████████████████████████████████   │ 60% Couleur Principale
│  ████████████████████                   │ (arrière-plan, grandes zones)
│                                         │
│  ░░░░░░░░░░░░░░░░░░                     │ 30% Couleur Secondaire
│  ░░░░░░░░░░░                            │ (sections, cartes, nav)
│                                         │
│  ▲▲▲▲▲                                  │ 10% Couleur d'Accent
│                                         │ (boutons, liens, highlights)
└─────────────────────────────────────────┘
```

### Exemple : MVola
- 60% Blanc (fond propre)
- 30% Bleu foncé (header, sections)
- 10% Orange (bouton d'action principal)

## Exercice 2 : Analyse de Palette (15 min)

### Ton objectif
Créer une palette pour une app fictive.

### Scénario : App "TikTok Mada"
Une app pour partager des vidéos courtes sur Madagascar.

### Questions :
1. Quelle couleur principale (60%) ? Pourquoi ?
2. Quelle couleur secondaire (30%) ? Pourquoi ?
3. Quelle couleur d'accent (10%) ? Pourquoi ?
4. Dessine ta palette sur papier avec les pourcentages.

### Contraintes
- L'app doit sentir "Madagascar"
- Elle doit être fun mais pas enfantine
- Les jeunes (18-30 ans) sont la cible

## 3. L'Espace (Whitespace) - La Respiration

### Qu'est-ce que le whitespace?

**Whitespace** = Espace vide = Respiration du design

Mais attention : "Espace vide" ne veut pas dire "gaspillage" !

### Analogie Madagascar 🇲🇬

Compare deux taxis-be :

**Taxi A (Bien espacé) :**
- 4 passagers sur 4 places
- Chacun est à l'aise
- Air circule bien
- Confortable

**Taxi B (Serré) :**
- 8 passagers sur 4 places
- Tout le monde est compressé
- Difficile de respirer
- Inconfortable

Le design, c'est pareil ! **Trop d'éléments = suffocant.**

### Les bienfaits du whitespace

✅ **Lisibilité améliorée** - Les yeux peuvent se reposer
✅ **Focus guidé** - L'important ressort
✅ **Élégance** - Le design paraît plus premium
✅ **Compréhension** - Le cerveau peut traiter l'info

### La règle des multiples de 8

En design, on utilise souvent des espacements en multiples de 8 :

```
8px  - Très petit espacement
16px - Petit espacement
24px - Moyen espacement
32px - Grand espacement
48px - Très grand espacement
64px - Section spacing
```

Pourquoi 8 ? Parce que la plupart des écrans utilisent des grilles de 8, et ça crée une harmonie naturelle.

## Exercice 3 : Comparaison Whitespace (10 min)

### Ton objectif
Comparer deux versions d'un même écran.

### Instructions :
1. Ouvre Facebook
2. Ouvre un site de petites annonces malgaches
3. Compare les deux :
   - Lequel est plus facile à lire ?
   - Lequel paraît plus professionnel ?
   - Pourquoi ?

### Analyse à écrire :
- Nombre d'éléments visibles sans scroller
- Espace entre les éléments
- Sensation globale (calme vs chaotique)

## 4. Les Boutons - Les Portes de l'Action

### Qu'est-ce qu'un bouton?

Un bouton = Une **porte** vers une action.

Quand tu cliques, quelque chose se passe. Le bouton doit donc dire clairement : **"CLIQUE-MOI !"**

### Les 4 qualités d'un bon bouton

**1. VISIBLE**
- Il doit se démarquer du fond
- Utiliser la couleur d'accent (les 10%)
- Contraste suffisant

**2. CLIQUABLE**
- Taille minimum : **44px × 44px** (taille d'un doigt)
- Forme reconnaissable (coins arrondis souvent)
- Effet de profondeur (ombre légère)

**3. CLAIR**
- Le texte dit exactement ce qui va se passer
- ❌ "OK" → trop vague
- ✅ "Envoyer le message" → clair

**4. RÉACTIF**
- États différents selon l'interaction :
  - **Normal** : État de base
  - **Hover** : Survole (souris dessus)
  - **Active** : En train de cliquer
  - **Disabled** : Non cliquable (grisé)

### Types de boutons

**1. Bouton Principal (Primary)**
- Couleur d'accent
- Pour l'action la plus importante
- Exemple : "Acheter maintenant", "Envoyer"

**2. Bouton Secondaire (Secondary)**
- Couleur plus neutre
- Pour les actions alternatives
- Exemple : "Annuler", "Retour"

**3. Bouton Tertiaire (Ghost/Text)**
- Pas de fond, juste du texte
- Pour les actions mineures
- Exemple : "En savoir plus", "Mot de passe oublié"

### Analogie Madagascar 🇲🇬

Les boutons sont comme les **portes dans une maison** :

- **Porte principale** = Bouton primaire (grande, colorée, évidente)
- **Porte de service** = Bouton secondaire (plus petite, neutre)
- **Trappe** = Bouton tertiaire (discrète, pour les initiés)

## Exercice 4 : Chasse aux Boutons (15 min)

### Ton objectif
Trouver et analyser 5 boutons différents.

### Apps à explorer :
1. WhatsApp
2. Facebook
3. MVola
4. Une app de ton choix

### Pour chaque bouton, note :
1. Sa taille approximative
2. Sa couleur (primaire, secondaire, tertiaire ?)
3. Son texte
4. Son état (y a-t-il un effet hover ?)
5. Est-ce un bon bouton ? Pourquoi ?

## Récapitulatif de la Leçon

### Les 4 Atomes du Design UI

```
┌────────────────────────────────────────────────────────────┐
│                    LES 4 ATOMES UI                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📝 TYPOGRAPHIE        →  2 polices max, hiérarchie claire │
│  🎨 COULEURS           →  60-30-10, psychologie            │
│  ⬜ ESPACE             →  Multiples de 8px, respiration    │
│  🔘 BOUTONS            →  44px min, visible, clair         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Phrases à retenir

- *"La typographie est la voix de ton design"*
- *"Les couleurs parlent avant les mots"*
- *"L'espace vide n'est pas perdu, il respire"*
- *"Un bon bouton se fait cliquer naturellement"*

## 📝 Quiz: Quiz : Les Éléments de Base

**1.** Combien de polices maximum doit-on utiliser dans un projet ?

   ⬜ 1 police
   ✅ 2 polices
   ⬜ 3 polices
   ⬜ Autant qu'on veut

*Maximum 2 polices pour garder la cohérence. Une pour les titres, une pour le corps de texte.*

**2.** Dans la règle 60-30-10, à quoi correspond le 10% ?

   ⬜ La couleur de fond
   ⬜ La couleur secondaire
   ✅ La couleur d'accent
   ⬜ La couleur du texte

*Le 10% est la couleur d'accent, utilisée pour les boutons et éléments importants.*

**3.** Quelle est la taille minimum recommandée pour un bouton tactile ?

   ⬜ 24px × 24px
   ⬜ 32px × 32px
   ✅ 44px × 44px
   ⬜ 64px × 64px

*44px × 44px est la taille minimum pour un doigt moyen sur un écran tactile.*

**4.** Quel espacement suit la règle des multiples de 8 ?

   ⬜ 10px
   ⬜ 12px
   ⬜ 15px
   ✅ 24px

*24px est un multiple de 8 (8 × 3 = 24). Les autres ne le sont pas.*

**5.** Quelle couleur est généralement utilisée pour indiquer un succès ?

   ⬜ Rouge
   ⬜ Bleu
   ✅ Vert
   ⬜ Jaune

*Le vert est universellement associé au succès, à la validation et à la croissance.*

## Devoirs pour demain

1. **Trouve 3 exemples** de mauvaise typographie (trop petite, illisible)
2. **Photographie** un panneau publicitaire à Tana et analyse ses couleurs
3. **Dessine** un bouton primaire et un bouton secondaire sur papier

**Durée estimée :** 20 minutes

