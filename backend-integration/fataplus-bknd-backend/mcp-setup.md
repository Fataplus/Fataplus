# MCP (Model Context Protocol) Setup - Fataplus Backend

## ✅ Configuration MCP Activée

### État Actuel
- **MCP Server**: ✅ Activé dans la configuration
- **Endpoint**: `/api/system/mcp`
- **Protocole Version**: 2025-06-18
- **Version bknd**: 0.19.0

### Configuration
```typescript
// config.ts
mcp: {
  enabled: true,
  path: "/api/system/mcp",
  logLevel: "info",
}
```

### 🛠️ Tools MCP Disponibles (45)

#### Data Management (10)
- `data_entity_delete_many` - Suppression multiple d'entités
- `data_entity_delete_one` - Suppression d'entité unique
- `data_entity_fn_count` - Comptage d'entités
- `data_entity_fn_exists` - Vérification d'existence
- `data_entity_info` - Informations sur une entité
- `data_entity_insert` - Insertion d'entité
- `data_entity_read_many` - Lecture multiple
- `data_entity_read_one` - Lecture unique
- `data_entity_update_many` - Mise à jour multiple
- `data_entity_update_one` - Mise à jour unique

#### System & Sync (4)
- `data_sync` - Synchronisation des données
- `data_types` - Types de données
- `system_build` - Build système
- `system_config` - Configuration système
- `system_info` - Informations système
- `system_ping` - Ping système

#### Authentication Config (9)
- `config_auth_get` - Get auth config
- `config_auth_roles_add` - Add auth role
- `config_auth_roles_get` - Get auth roles
- `config_auth_roles_remove` - Remove auth role
- `config_auth_roles_update` - Update auth role
- `config_auth_strategies_add` - Add auth strategy
- `config_auth_strategies_get` - Get auth strategies
- `config_auth_strategies_remove` - Remove auth strategy
- `config_auth_strategies_update` - Update auth strategy
- `config_auth_update` - Update auth config

#### Data Config (12)
- `config_data_entities_add` - Add data entity
- `config_data_entities_get` - Get data entities
- `config_data_entities_remove` - Remove data entity
- `config_data_entities_update` - Update data entity
- `config_data_get` - Get data config
- `config_data_indices_add` - Add data index
- `config_data_indices_get` - Get data indices
- `config_data_indices_remove` - Remove data index
- `config_data_relations_add` - Add data relation
- `config_data_relations_get` - Get data relations
- `config_data_relations_remove` - Remove data relation
- `config_data_relations_update` - Update data relation
- `config_data_update` - Update data config

#### Media Config (4)
- `config_media_adapter_get` - Get media adapter
- `config_media_adapter_update` - Update media adapter
- `config_media_get` - Get media config
- `config_media_update` - Update media config

#### Server Config (2)
- `config_server_get` - Get server config
- `config_server_update` - Update server config

### 📚 Resources MCP (3)
- `data_entities` - Entités de données
- `data_relations` - Relations de données
- `data_indices` - Index de données

## 🚀 Utilisation

### Initialisation MCP
```bash
curl -X POST https://bknd.fata.plus/api/system/mcp \
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

### Exemple d'utilisation de tool
```bash
curl -X POST https://bknd.fata.plus/api/system/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "system_info",
      "arguments": {}
    }
  }'
```

### Lister les entités disponibles
```bash
curl -X POST https://bknd.fata.plus/api/system/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "data_entity_info",
      "arguments": {
        "entity": "clients"
      }
    }
  }'
```

## 🎯 Applications pour Fataplus

### 1. Gestion des Clients
- Création/Mise à jour des clients via MCP
- Lecture des données client pour les applications externes

### 2. Suivi de Projets
- Interface MCP pour les systèmes externes
- Synchronisation avec d'autres plateformes

### 3. Données Agricoles
- Collecte de données via MCP
- Intégration avec les systèmes d'irrigation

### 4. Automatisation
- Scripts d'administration via MCP
- Intégration avec CI/CD

## 🔧 Développement Local

```bash
# Démarrer le serveur MCP local
npx bknd mcp --force --verbose

# Tester les tools MCP
npx bknd mcp --help
```

## 🌐 URLs

- **Production**: https://bknd.fata.plus/api/system/mcp
- **Développement**: https://fataplus-bknd-backend.fenohery.workers.dev/api/system/mcp

---

*Le protocole MCP est maintenant activé et prêt pour l'intégration avec des systèmes externes*