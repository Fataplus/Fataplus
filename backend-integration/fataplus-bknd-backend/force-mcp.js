#!/usr/bin/env node

/**
 * Script pour forcer l'activation de MCP via l'API de configuration
 */

const API_BASE = 'https://fataplus-bknd-backend.fenohery.workers.dev';

async function forceEnableMCP() {
  try {
    console.log('🔧 Forçage de l\'activation MCP...');

    // Récupérer la configuration actuelle
    const configResponse = await fetch(`${API_BASE}/api/system/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!configResponse.ok) {
      throw new Error('Impossible de récupérer la configuration');
    }

    const config = await configResponse.json();
    console.log('📊 Configuration MCP actuelle:', config.server?.mcp);

    // Mettre à jour la configuration pour activer MCP
    const updatedConfig = {
      ...config,
      version: config.version + 1,
      server: {
        ...config.server,
        mcp: {
          enabled: true,
          path: "/api/system/mcp",
          logLevel: "info"
        }
      }
    };

    console.log('🔄 Tentative de mise à jour de la configuration...');

    // Utiliser l'endpoint de mise à jour de configuration
    const updateResponse = await fetch(`${API_BASE}/api/system/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedConfig)
    });

    if (updateResponse.ok) {
      console.log('✅ Configuration mise à jour avec succès!');
      console.log('🔄 Déclenchement du rebuild système...');

      // Déclencher un rebuild
      const buildResponse = await fetch(`${API_BASE}/api/system/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true })
      });

      if (buildResponse.ok) {
        console.log('✅ Rebuild système déclenché!');
        return true;
      } else {
        console.log('⚠️  Le rebuild a échoué, mais la configuration a été mise à jour');
        return true;
      }
    } else {
      console.log('❌ Échec de la mise à jour de la configuration');
      const errorText = await updateResponse.text();
      console.log('Détail de l\'erreur:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

forceEnableMCP().then(success => {
  if (success) {
    console.log('\n🎉 MCP a été activé avec succès!');
    console.log('📍 URL: https://fataplus-bknd-backend.fenohery.workers.dev/api/system/mcp');
    console.log('⏱️  Attendez 30 secondes pour la propagation des changements...');
  } else {
    console.log('\n⚠️  L\'activation MCP a échoué.');
  }
});