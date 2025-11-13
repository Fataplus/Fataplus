# Test d'Authentification - Fataplus Backend

## Configuration

- **URL Backend**: https://bknd.fata.plus (une fois le DNS configuré)
- **URL Temporaire**: https://fataplus-bknd-backend.fenohery.workers.dev
- **Interface Admin**: /admin

## Utilisateur Admin Créé

- **Email**: fenohery.fanomezanirina@gmail.com
- **Mot de passe**: admin123
- **Rôle**: admin

## Étapes pour se connecter

1. Accéder à l'interface d'administration:
   - Temporaire: https://fataplus-bknd-backend.fenohery.workers.dev/admin
   - Final: https://bknd.fata.plus/admin

2. Utiliser les identifiants:
   - Email: fenohery.fanomezanirina@gmail.com
   - Mot de passe: admin123

3. Une fois connecté, vous pourrez:
   - Gérer les collections de données
   - Configurer les entités
   - Gérer les utilisateurs
   - Accéder à l'interface visuelle

## Configuration DNS

Pour que `bknd.fata.plus` fonctionne, vous devez ajouter un enregistrement DNS:
- **Type**: A
- **Nom**: bknd
- **Valeur**: Adresse IP du Worker Cloudflare (gérée automatiquement)
- **TTL**: Automatique

## Sécurité

⚠️ **IMPORTANT**: Changez le mot de passe temporaire `admin123` lors de la première connexion!

## Test API

Pour tester l'API, vous pouvez utiliser:
```bash
curl -X POST https://fataplus-bknd-backend.fenohery.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fenohery.fanomezanirina@gmail.com","password":"admin123"}'
```