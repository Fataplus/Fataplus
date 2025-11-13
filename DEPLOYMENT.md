# Déploiement GitHub - Instructions Manuelles

## 🚀 Push vers GitHub

### 1. Créer le Repository sur GitHub

1. Allez sur https://github.com/new
2. Nom du repository : **fataplus-interoperabilite**
3. Organisation : **fataplus** (si existante) ou votre compte
4. Description : "Fataplus CRM - AI-powered multi-tenant CRM system for digital agency"
5. Repository : **Public**
6. **NE PAS** cocher "Add a README file" (déjà créé)
7. **NE PAS** cocher "Add .gitignore" (déjà créé)
8. Cliquez sur **Create repository**

### 2. Connecter et Pusher

```bash
cd "/Users/fefe/Documents/Fataplus/fataplus-interoperabilite"

# Ajouter le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/fataplus-interoperabilite.git

# Ou si vous avez une organisation fataplus:
git remote add origin https://github.com/fataplus/fataplus-interoperabilite.git

# Pusher vers GitHub
git push -u origin main
```

### 3. Si vous utilisez une organisation fataplus

```bash
# Ajouter le remote de l'organisation
git remote add origin https://github.com/fataplus/fataplus-interoperabilite.git

# Pusher
git push -u origin main
```

## 📋 Vérification

Après le push, vérifiez que tous les dossiers sont bien présents :
- ✅ frontend/
- ✅ backend-integration/
- ✅ documentation/
- ✅ collaboration/
- ✅ bootcamp/
- ✅ agritech/
- ✅ README.md
- ✅ ARCHITECTURE.md
- ✅ INVENTAIRE.md

## 🔐 Configuration (Optionnel)

Si vous avez des fichiers sensibles, ajoutez-les au .gitignore avant de pusher :

```bash
# Vérifier les fichiers sensibles
find . -name "*.key" -o -name "*.pem" -o -name ".env*" -o -name "*secret*"

# Ajouter au .gitignore si nécessaire
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
echo ".env*" >> .gitignore
```

---
*Repository prêt pour le développement collaboratif multi-tenant !*