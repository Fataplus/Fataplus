# Guide d'Activation MCP - Fataplus Backend

## 🔍 État Actuel

- **Backend déployé**: ✅ https://fataplus-bknd-backend.fenohery.workers.dev
- **Configuration locale MCP**: ✅ Activée et fonctionnelle
- **Configuration production MCP**: ❌ Non activée
- **Authentification**: ❌ Endpoint `/api/auth` non accessible

## 🎯 Solution Immédiate

### Option 1: Activer MCP via l'Interface d'Administration

1. **Accédez à l'interface admin**:
   ```
   https://fataplus-bknd-backend.fenohery.workers.dev/
   ```

2. **Connectez-vous** avec les identifiants admin:
   - **Email**: fenohery.fanomezanirina@gmail.com
   - **Mot de passe**: admin123

3. **Accédez à la configuration système**:
   - Cherchez "Settings" ou "Configuration"
   - Allez dans "Server Settings" ou "Advanced Settings"

4. **Activez MCP**:
   - Trouvez l'option "MCP" (Model Context Protocol)
   - Cochez "Enable MCP"
   - Configurez le path: `/api/system/mcp`
   - Log level: `info`
   - Sauvegardez

5. **Redémarrez le serveur**:
   - Utilisez l'option "Rebuild" ou "Restart"

### Option 2: Utiliser l'API système (si authentification fonctionnelle)

```bash
# 1. S'authentifier
curl -X POST https://fataplus-bknd-backend.fenohery.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fenohery.fanomezanirina@gmail.com","password":"admin123"}' \
  -c cookies.txt

# 2. Mettre à jour la configuration
curl -X POST https://fataplus-bknd-backend.fenohery.workers.dev/api/system/config \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"server":{"mcp":{"enabled":true,"path":"/api/system/mcp","logLevel":"info"}}}'

# 3. Rebuild
curl -X POST https://fataplus-bknd-backend.fenohery.workers.dev/api/system/build \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"force":true}'
```

### Option 3: Configuration Directe Base de Données

Si vous avez accès à la base de données via Cloudflare Dashboard:

1. Allez dans **Workers & Pages** → **D1** → **fataplus-website-db**
2. Exécutez cette requête SQL:
```sql
UPDATE __bknd
SET json = JSON_SET(
  json,
  '$.server.mcp.enabled', 'true',
  '$.server.mcp.logLevel', 'info'
)
WHERE type = 'config';
```

## ✅ Vérification

Une fois MCP activé, testez avec:

```bash
curl -X POST https://fataplus-bknd-backend.fenohery.workers.dev/api/system/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "fataplus-client",
        "version": "1.0.0"
      }
    }
  }'
```

Réponse attendue:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {},
      "resources": {},
      "logging": {},
      "completions": {}
    },
    "serverInfo": {
      "name": "bknd",
      "version": "0.19.0"
    }
  }
}
```

## 🌐 URLs Finales

- **Backend**: https://bknd.fata.plus *(après configuration DNS)*
- **Backend temporaire**: https://fataplus-bknd-backend.fenohery.workers.dev
- **MCP**: https://bknd.fata.plus/api/system/mcp *(après activation)*
- **MCP temporaire**: https://fataplus-bknd-backend.fenohery.workers.dev/api/system/mcp

## 🔧 Développement Local (Fonctionnel)

Pour le développement, MCP fonctionne parfaitement:

```bash
cd /Users/fefe/Documents/fataplus-website/fataplus-bknd-backend
npm run dev
# Sur http://localhost:53520/api/system/mcp

# Ou avec le serveur MCP direct
npx bknd mcp --force --verbose
```

## 🎯 Prochaines Étapes

1. **Activer MCP** via l'interface admin (Option 1)
2. **Configurer le DNS** pour bknd.fata.plus
3. **Tester l'intégration** MCP avec vos applications
4. **Documenter les tools MCP** pour votre équipe

---

*Note: MCP est déjà configuré dans le code et fonctionne localement. Il ne manque que l'activation en production.*