# Legal Documents PDF Generation

## 📄 Vue d'Ensemble

Ce système convertit automatiquement les documents légaux FATAPLUS (Markdown) en PDFs professionnels et formatés.

## 🎯 Documents Concernés

Les documents légaux suivants sont automatiquement convertis :

1. **Conditions Générales d'Utilisation** (`terms.md` → `terms.pdf`)
2. **Politique de Confidentialité** (`privacy.md` → `privacy.pdf`) 
3. **Politique des Cookies** (`cookies.md` → `cookies.pdf`)
4. **Procédure de Suppression de Compte** (`delete-account.md` → `delete-account.pdf`)
5. **Présentation FATAPLUS** (`fataplus-pitch-deck.md` → `fataplus-pitch-deck.pdf`)
6. **Politique de Retour et Remboursement** (`return-policy.md` → `return-policy.pdf`)
7. **EULA - Licence Utilisateur Final** (`eula.md` → `eula.pdf`)

## 🚀 Utilisation

### Commande Rapide

```bash
npm run legal:pdf
```

### Commande Manuelle

```bash
node scripts/convert-legal-to-pdf.js
```

## 📁 Structure des Fichiers

```
project/
├── content/legal/          # Documents sources (Markdown)
│   ├── terms.md
│   ├── privacy.md
│   ├── cookies.md
│   ├── delete-account.md
│   └── fataplus-pitch-deck.md
├── public/legal-pdfs/      # PDFs générés
│   ├── terms.pdf
│   ├── privacy.pdf
│   ├── cookies.pdf
│   ├── delete-account.pdf
│   └── fataplus-pitch-deck.pdf
└── scripts/
    └── convert-legal-to-pdf.js  # Script de conversion
```

## 🎨 Formatage PDF

### Style Professionnel

- **Police** : Georgia (serif) pour une lisibilité optimale
- **Couleurs** : Thème vert FATAPLUS (#2E7D32, #4CAF50)
- **Format** : A4 avec marges appropriées
- **En-têtes** : Logo et titre de section
- **Pieds de page** : Numérotation des pages

### Éléments Automatiques

- **En-tête de document** : Titre, sous-titre, date de mise à jour
- **Formatage** : Conversion Markdown → HTML → PDF
- **Liens** : Préservation des liens cliquables
- **Pagination** : Numérotation automatique
- **Footer** : Informations de contact FATAPLUS

## 🔧 Configuration Technique

### Dépendances

```json
{
  "marked": "^16.0.0", // Parsing Markdown
  "puppeteer": "^24.12.0" // Génération PDF
}
```

### Options PDF

- **Format** : A4
- **Marges** : 20mm (haut/bas), 15mm (gauche/droite)
- **Qualité** : Haute définition
- **Arrière-plan** : Préservé (pour styles)
- **En-têtes/Pieds** : Automatiques

## 📊 Résultat Typique

```
🚀 Conversion des documents légaux FATAPLUS en PDF...

📁 Fichiers trouvés: 5
   - cookies.md
   - delete-account.md
   - fataplus-pitch-deck.md
   - privacy.md
   - terms.md

📄 Traitement de: cookies.md
✅ PDF généré: public/legal-pdfs/cookies.pdf

📄 Traitement de: delete-account.md
✅ PDF généré: public/legal-pdfs/delete-account.pdf

📄 Traitement de: fataplus-pitch-deck.md
✅ PDF généré: public/legal-pdfs/fataplus-pitch-deck.pdf

📄 Traitement de: privacy.md
✅ PDF généré: public/legal-pdfs/privacy.pdf

📄 Traitement de: terms.md
✅ PDF généré: public/legal-pdfs/terms.pdf

✅ Conversion terminée!
📂 PDFs disponibles dans: public/legal-pdfs

📑 PDFs générés:
   - cookies.pdf (111.4 KB)
   - delete-account.pdf (108.1 KB)
   - fataplus-pitch-deck.pdf (294.0 KB)
   - privacy.pdf (135.1 KB)
   - terms.pdf (137.1 KB)
```

## 🔄 Automatisation

### Intégration CI/CD

Le script peut être intégré dans votre pipeline CI/CD :

```yaml
# .github/workflows/legal-docs.yml
- name: Generate Legal PDFs
  run: npm run legal:pdf

- name: Upload PDFs
  uses: actions/upload-artifact@v3
  with:
    name: legal-pdfs
    path: public/legal-pdfs/
```

### Hooks Git

Pour régénérer automatiquement lors de modifications :

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run legal:pdf
git add public/legal-pdfs/
```

## 🌐 Accès Web

Les PDFs générés sont accessibles via :

- `https://fata.plus/legal-pdfs/terms.pdf`
- `https://fata.plus/legal-pdfs/privacy.pdf`
- `https://fata.plus/legal-pdfs/cookies.pdf`
- `https://fata.plus/legal-pdfs/delete-account.pdf`
- `https://fata.plus/legal-pdfs/fataplus-pitch-deck.pdf`

## 🔍 Personnalisation

### Modifier le Style

Éditez les `CSS_STYLES` dans `scripts/convert-legal-to-pdf.js` :

```javascript
const CSS_STYLES = `
<style>
  body {
    font-family: 'Georgia', serif;
    // Vos personnalisations...
  }
</style>
`;
```

### Ajouter de Nouveaux Documents

1. Créez le fichier `.md` dans `content/legal/`
2. Ajoutez le mapping dans `formatMarkdownContent()`
3. Exécutez `npm run legal:pdf`

## ⚠️ Notes Importantes

### Formats Supportés

- **Entrée** : Markdown (.md)
- **Sortie** : PDF haute qualité
- **Encodage** : UTF-8 (support accents français)
- **Langue** : Français (formatage dates)

### Limitations

- Taille maximale : ~50 pages par document
- Images : Doivent être optimisées
- Tableaux : Formatage basique

### Maintenance

- Testez après modification des sources
- Vérifiez la qualité des PDFs générés
- Mettez à jour les dates automatiquement

## 🆘 Dépannage

### Erreurs Communes

**Erreur Puppeteer** :

```bash
npm install puppeteer --legacy-peer-deps
```

**Permissions** :

```bash
chmod +x scripts/convert-legal-to-pdf.js
```

**Dossier manquant** :

```bash
mkdir -p public/legal-pdfs
```

## 📞 Support

Pour toute question technique :

- **Email** : contact@fata.plus
- **Documentation** : [docs/](../README.md)
- **Issues** : Créer un ticket GitHub

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0  
**Compatibilité** : Node.js 18+, Nuxt 3+
