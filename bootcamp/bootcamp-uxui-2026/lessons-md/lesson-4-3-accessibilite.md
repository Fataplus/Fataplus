# Accessibilité - Designer pour Tous

**Module:** Jour 4 - Design Systems & Outils IA
**Slug:** accessibilite

---

# Accessibilité - Designer pour Tous

## Qu'est-ce que l'accessibilité?

L'**accessibilité** (a11y) signifie que ton design peut être utilisé par **toute personne**, quelle que soit sa capacité.

### Analogie Madagascar 🇲🇬

L'accessibilité, c'est comme une **rampe d'accès** dans un bâtiment :
- Sans rampe : Une personne en fauteuil ne peut pas entrer
- Avec rampe : Tout le monde peut entrer (fauteuil, poussette, vélo)

Designer avec accessibilité = **Rendre le web accessible à tous**.

## Pourquoi l'accessibilité est importante?

### Les chiffres

🌍 **1 milliard de personnes** dans le monde vivent avec un handicap

Types de handicaps :
- 👁️ **Visuel** : Cécité, malvoyance, daltonisme (300M)
- 👂 **Auditif** : Surdité, malentendance (466M)
- 🖐️ **Moteur** : Difficultés de mouvement (190M)
- 🧠 **Cognitif** : Dyslexie, TDAH, troubles de l'attention
- 👴 **Âge** : Les capacités diminuent avec l'âge

### En Madagascar

Beaucoup de personnes âgées utilisent les téléphones :
- Vue qui baisse = Besoin de textes plus grands
- Mains moins agiles = Besoin de boutons plus grands
- Mémoire qui faiblit = Besoin d'interfaces simples

## Les 4 principes de l'accessibilité (POUR)

```
┌─────────────────────────────────────────────────────────────┐
│            PRINCIPES WCAG (Web Content Accessibility)       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 PERCEVABLE                                              │
│     L'info doit être présentée de façon perceptible        │
│     (visible, audible)                                      │
│                                                             │
│  🎮 UTILISABLE                                              │
│     L'interface doit être opérable                         │
│     (clavier, touch, voix)                                  │
│                                                             │
│  🧠 COMPRÉHENSIBLE                                          │
│     L'info et l'interface doivent être compréhensibles     │
│     (clair, prévisible)                                     │
│                                                             │
│  💪 ROBUSTE                                                 │
│     Le contenu doit être compatible                        │
│     (technologies d'assistance)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 1. Percevable - Voir et Entendre

### A. Contraste des couleurs

Le contraste détermine si le texte est lisible.

**Règle WCAG :**
- **Texte normal** : Contraste minimum 4.5:1
- **Texte large (18px+)** : Contraste minimum 3:1
- **AAA (excellent)** : Contraste 7:1

**Exemples :**

```
❌ MAUVAIS (Contraste 2.1:1)
┌─────────────────────────────────┐
│ Texte gris clair sur blanc     │
│ #AAAAAA sur #FFFFFF            │
│ Difficile à lire               │
└─────────────────────────────────┘

✅ BON (Contraste 7.5:1)
┌─────────────────────────────────┐
│ Texte gris foncé sur blanc     │
│ #595959 sur #FFFFFF            │
│ Facile à lire                   │
└─────────────────────────────────┘
```

### Comment vérifier le contraste?

**Outils gratuits :**
- **WebAIM Contrast Checker** : webaim.org/resources/contrastchecker
- **Figma Plugin** : Able, Contrast
- **Chrome DevTools** : Inspecter → Accessibility

### Exercice : Vérifier le contraste (10 min)

1. Ouvre le site MVola
2. Utilise un outil de contraste
3. Vérifie si le texte est assez contrasté
4. Note les problèmes trouvés

### B. Ne pas utiliser seulement la couleur

⚠️ **La couleur ne doit jamais être le SEUL moyen de transmettre une information.**

**Exemple : Messages d'erreur**

```
❌ MAUVAIS
┌─────────────────────────────────┐
│ [__________]  (bordure rouge)  │
│ Champ invalide                  │
│ Un daltonien ne voit pas l'erreur│
└─────────────────────────────────┘

✅ BON
┌─────────────────────────────────┐
│ [__________]  (bordure rouge)  │
│ ⚠️ Champ invalide               │
│ Icône + texte + couleur         │
└─────────────────────────────────┘
```

### C. Texte alternatif pour les images

Les lecteurs d'écran (pour aveugles) ont besoin de **descriptions textuelles** des images.

**Règles :**
- Images informatives → Décrire le contenu
- Images décoratives → alt="" (vide)
- Images avec texte → Décrire le texte

**Exemples :**

```
❌ MAUVAIS
<img src="ravitoto.jpg" alt="image">

✅ BON
<img src="ravitoto.jpg" alt="Plat de ravitoto au porc dans une assiette en terre cuite">
```

## 2. Utilisable - Naviguer et Interagir

### A. Navigation au clavier

Toutes les fonctionnalités doivent être accessibles **sans souris**.

**Touches importantes :**
- **Tab** : Passer à l'élément suivant
- **Shift + Tab** : Élément précédent
- **Enter** : Activer (bouton, lien)
- **Espace** : Cocher une case
- **Flèches** : Naviguer dans les listes

**Indicateur de focus :**
```
❌ MAUVAIS
outline: none;  /* Pas d'indicateur */

✅ BON
outline: 2px solid blue;
outline-offset: 2px;
```

### B. Taille des zones tactiles

**Règle :** Minimum **44 × 44 pixels** pour les zones cliquables.

```
❌ MAUVAIS                    ✅ BON
┌─────────┐                 ┌─────────────┐
│   OK    │  30×30px       │    Cliquer   │  44×44px
└─────────┘                 └─────────────┘
 Difficile à cliquer          Facile à cliquer
```

### C. Temps suffisant

Pour les actions avec limite de temps :
- Permettre de **prolonger** le temps
- Pas de limite si possible
- Avertir avant expiration

## 3. Compréhensible - Clair et Prévisible

### A. Langue claire et simple

**Règles :**
- Niveau de lecture : **8ème année** (13 ans)
- Phrases courtes : **15-20 mots max**
- Éviter le jargon technique
- Expliquer les acronymes

**Exemple :**

```
❌ MAUVAIS
"Votre session a expiré en raison d'une inactivité 
prolongée. Veuillez vous réauthentifier."

✅ BON
"Vous avez été déconnecté. Connectez-vous à nouveau."
```

### B. Labels explicites

Chaque champ de formulaire doit avoir un **label clair**.

```
❌ MAUVAIS
┌─────────────────────────────────┐
│ [Rechercher...]                  │  Placeholder seul
└─────────────────────────────────┘

✅ BON
┌─────────────────────────────────┐
│ Rechercher une recette           │  Label visible
│ [Tapez le nom...]                │  Placeholder
└─────────────────────────────────┘
```

### C. Prévisibilité

Les éléments doivent se comporter comme prévu.

**Règles :**
- Un lien doit aller à une nouvelle page
- Un bouton ne doit pas changer d'emplacement
- Les erreurs doivent être expliquées clairement
- Les changements de contexte doivent être annoncés

### D. Prévention des erreurs

**Actions réversibles ou confirmées :**
- Suppression → Demander confirmation
- Changements importants → Permettre d'annuler
- Formulaires → Sauvegarder automatiquement

## 4. Robuste - Compatible et Futur-proof

### A. Code sémantique

Utiliser les bonnes balises HTML :

```
❌ MAUVAIS                    ✅ BON
<div onclick="...">         <button onclick="...">
  Cliquer                      Cliquer
</div>                       </button>

<div class="heading">       <h1>
  Titre                        Titre
</div>                       </h1>
```

### B. ARIA (Accessible Rich Internet Applications)

Quand le HTML ne suffit pas, utiliser **ARIA** :

- **role** : Définir le rôle (button, navigation)
- **aria-label** : Nom accessible
- **aria-describedby** : Description
- **aria-hidden** : Masquer aux lecteurs d'écran

**Exemple :**
```html
<button aria-label="Fermer le menu">
  <svg>...</svg>  <!-- Icône X -->
</button>
```

## Les erreurs les plus courantes

### Top 5 des erreurs d'accessibilité

**1. Contraste insuffisant**
- Texte trop clair sur fond clair
- Solution : Vérifier avec un outil de contraste

**2. Manque de labels**
- Formulaires sans labels
- Solution : Ajouter des labels visibles

**3. Images sans alt**
- Images décoratives sans alt=""
- Images informatives sans description
- Solution : Toujours ajouter alt

**4. Navigation clavier impossible**
- Éléments cliquables uniquement à la souris
- Solution : Tester au clavier

**5. Focus invisible**
- outline: none sans alternative
- Solution : Style de focus visible

## Exercice pratique : Audit d'accessibilité (30 min)

### Objectif
Auditer l'accessibilité d'une app populaire.

### Outils
- **WAVE** : wave.webaim.org (extension Chrome)
- **Lighthouse** : Chrome DevTools → Lighthouse
- **Accessibility Insights** : Extension Chrome

### Tâches

1. **Installer WAVE** (extension Chrome)
2. **Ouvrir** une app de ton choix (ex: Facebook, MVola)
3. **Activer WAVE** et analyser
4. **Noter** les problèmes :
   - 🔴 Erreurs (Errors)
   - 🟡 Alertes (Alerts)
   - 🟢 Points forts (Features)
5. **Proposer** 3 améliorations concrètes

### Grille d'audit

```
┌─────────────────────────────────────────────────────────────┐
│           GRILLE D'AUDIT ACCESSIBILITÉ                      │
├─────────────────────────────────────────────────────────────┤
│ Critère                    │ OK │ Non OK │ Notes          │
├─────────────────────────────────────────────────────────────┤
│ Contraste texte            │    │        │                │
│ Labels formulaires         │    │        │                │
│ Alt images                 │    │        │                │
│ Navigation clavier         │    │        │                │
│ Focus visible              │    │        │                │
│ Taille boutons (44px)      │    │        │                │
│ Langue claire              │    │        │                │
│ Messages d'erreur clairs   │    │        │                │
└─────────────────────────────────────────────────────────────┘
```

## Accessibilité et Business

### Pourquoi ça compte?

**1. Marché plus large**
- 15% de la population mondiale = handicap
- Ignorer = Perdre 15% de clients potentiels

**2. Légal**
- Lois d'accessibilité dans de nombreux pays
- RGAA (France), ADA (USA)

**3. SEO**
- Google valorise les sites accessibles
- Structure sémantique = meilleur référencement

**4. UX pour tous**
- Accessibilité améliore l'expérience pour tous
- Sous-titles aident en milieu bruyant
- Contraste aide en plein soleil

## Récapitulatif de la leçon

### Ce que tu as appris :

```
┌─────────────────────────────────────────────────────────────┐
│                 ACCESSIBILITÉ (A11Y)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 PERCEVABLE      →  Contraste, couleurs, alt text       │
│  🎮 UTILISABLE      →  Clavier, taille zones tactiles      │
│  🧠 COMPRÉHENSIBLE  →  Langue claire, labels, prévisible   │
│  💪 ROBUSTE         →  Code sémantique, ARIA               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Contraste minimum : 4.5:1                               │
│  ✅ Boutons minimum : 44×44px                               │
│  ✅ Toujours tester au clavier                              │
│  ✅ Toujours ajouter alt aux images                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Checklist accessibilité pour chaque projet

**Avant de livrer :**

- [ ] Contraste vérifié (4.5:1 minimum)
- [ ] Tous les formulaires ont des labels
- [ ] Toutes les images ont un alt
- [ ] Navigation au clavier testée
- [ ] Focus visible sur tous les éléments
- [ ] Boutons minimum 44×44px
- [ ] Texte lisible (16px minimum)
- [ ] Messages d'erreur clairs
- [ ] Test avec WAVE ou Lighthouse

## 📝 Quiz: Quiz : Accessibilité

**1.** Quel est le contraste minimum recommandé pour du texte normal ?

   ⬜ 2:1
   ⬜ 3:1
   ✅ 4.5:1
   ⬜ 7:1

*Le contraste minimum WCAG AA pour du texte normal est de 4.5:1.*

**2.** Quelle est la taille minimum pour une zone tactile ?

   ⬜ 32×32px
   ✅ 44×44px
   ⬜ 48×48px
   ⬜ 64×64px

*La taille minimum recommandée est de 44×44 pixels pour être facilement cliquable.*

**3.** Que signifie l'attribut alt sur une image ?

   ⬜ Alternative colorée
   ✅ Texte alternatif pour lecteurs d'écran
   ⬜ Alignement du texte
   ⬜ Animation alternative

*L'attribut alt fournit une description textuelle pour les lecteurs d'écran.*

**4.** Comment navigue un utilisateur au clavier ?

   ⬜ Avec la souris
   ✅ Avec Tab et Enter
   ⬜ Avec les flèches seulement
   ⬜ Impossible

*Tab permet de naviguer entre les éléments et Enter permet d'activer.*

**5.** Que signifie POUR en accessibilité ?

   ⬜ Pour les utilisateurs
   ✅ Percevable, Utilisable, Compréhensible, Robuste
   ⬜ Pratique, Utile, Original, Rapide
   ⬜ Programmable, Universel, Optimal, Réactif

*POUR = Percevable, Operable (Utilisable), Understandable (Compréhensible), Robust.*

## Devoirs pour demain

1. **Installer** l'extension WAVE sur Chrome
2. **Auditer** 2 sites que tu utilises souvent
3. **Créer** un bouton accessible dans Figma :
   - Contraste 7:1 minimum
   - Taille 44×44px minimum
   - Focus visible
4. **Réfléchir** : Quels sites malgaches sont accessibles ?

**Durée estimée :** 30 minutes

### Ressources :
- [WAVE](https://wave.webaim.org)
- [WebAIM](https://webaim.org)
- [MDN Accessibility](https://developer.mozilla.org/fr/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com)

