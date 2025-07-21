# Guide de Structuration des Slides Fataplus

## Référence : [nooqta/ai-presentation](https://github.com/nooqta/ai-presentation)

---

Ce guide s’inspire des bonnes pratiques du projet open source [ai-presentation](https://github.com/nooqta/ai-presentation), un générateur de présentations Reveal.js piloté par l’IA.

## 🗂️ Structure Générale

- **Plan (Outline) d’abord** : Définir un plan clair, chaque point principal devient une slide.
- **1 slide = 1 idée** : Chaque `<section>` HTML correspond à une slide Reveal.js.
- **Navigation fluide** : Utilisation des flèches clavier, responsive mobile/desktop.
- **Fichier principal** : `slidejs.html` (ou `slides.html`), structure Reveal.js standard.

## 🛠️ Bonnes Pratiques

- **Titres clairs** : Utiliser des titres de section explicites (h1, h2, h3 selon la hiérarchie Fataplus).
- **Simplicité** : Privilégier des phrases courtes, des listes à puces, des visuels.
- **Uniformité** : Respecter la charte graphique et le guide de polices Fataplus.
- **Modularité** : Chaque module ou grande idée = 1 slide.
- **Visuels** : Ajouter des images, schémas ou icônes si possible pour illustrer.
- **Navigation** : Tester la navigation Reveal.js (flèches, mobile, etc.).

## 📄 Exemple de Structure HTML

```html
<div class="reveal">
  <div class="slides">
    <section>
      <h1>Titre principal</h1>
      <p>Introduction ou contexte.</p>
    </section>
    <section>
      <h2>Module 1 : Titre</h2>
      <ul>
        <li>Point clé 1</li>
        <li>Point clé 2</li>
      </ul>
    </section>
    <!-- ...autres sections... -->
    <section>
      <h2>Conclusion</h2>
      <p>Résumé, appel à l’action.</p>
    </section>
  </div>
</div>
```

## 🔗 Ressources

- [nooqta/ai-presentation sur GitHub](https://github.com/nooqta/ai-presentation)
- [Reveal.js Documentation](https://revealjs.com/)
- [Guide des Polices Fataplus](./FONT_GUIDE.md)

---

**À utiliser pour toute nouvelle présentation Fataplus afin d’assurer cohérence, clarté et impact.**
