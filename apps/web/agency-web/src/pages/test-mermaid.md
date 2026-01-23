---
layout: ../layouts/BaseLayout.astro
title: Mermaid Test
---

# Mermaid Test

Here is a simple Mermaid diagram:

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
Customer Journey Maps - EGS Gallois Sisal

Journey Map : Pierre (Acheteur B2B)

```mermaid
journey
    title Parcours d'Achat de Pierre
    section Découverte
      Recherche Google "Sisal Supplier": 3: Pierre
      Arrivée sur Homepage: 4: Pierre
      Première impression (Design Pro): 5: Pierre
    section Considération
      Navigation vers "Nos Produits": 5: Pierre
      Lecture Tableau des Grades: 4: Pierre
      Recherche Certification (Manque info visible?): 3: Pierre
      Trouve info Qualité: 4: Pierre
    section Décision
      Clic CTA "Contacter": 5: Pierre
      Remplissage Formulaire: 4: Pierre
      Envoi & Confirmation: 5: Pierre
    section Fidélisation (Post-Site)
      Réception Devis (Email): 5: Pierre
      Commande: 5: Pierre
```

Journey Map : Sarah (Investisseuse Impact)

```mermaid
journey
    title Parcours d'Investigation de Sarah
    section Découverte
      Article Presse/LinkedIn: 4: Sarah
      Arrivée sur Homepage: 4: Sarah
      Clic "Transition & Impacts": 5: Sarah
    section Analyse
      Lecture "3 Axes Transformation": 5: Sarah
      Vérification Partenaires (Miarakap, etc.): 5: Sarah
      Recherche Rapports/Chiffres (Manque détails?): 3: Sarah
    section Validation
      Lecture Vision "À Propos": 4: Sarah
      Clic CTA "Projets Innovation": 5: Sarah
    section Action
      Page Contact: 4: Sarah
      Envoi demande RDV: 5: Sarah
```

Journey Map : Toky (Candidat)

```mermaid
journey
    title Parcours de Candidature de Toky
    section Attraction
      Voit post LinkedIn EGS: 4: Toky
      Clic lien vers Site Carrière: 5: Toky
    section Intérêt
      Lecture "Construire Ensemble": 5: Toky
      Découverte Valeurs & Culture: 5: Toky
      Recherche Offres Agronomie: 3: Toky
    section Action
      Aucune offre active trouvée: 2: Toky
      Voit "Candidature Spontanée": 4: Toky
      Clic lien Google Form: 4: Toky
    section Candidature
      Remplissage Formulaire: 3: Toky
      Envoi CV: 4: Toky
      Attente réponse: 3: Toky
```