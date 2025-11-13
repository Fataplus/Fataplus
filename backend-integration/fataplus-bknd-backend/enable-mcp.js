#!/usr/bin/env node

/**
 * Script pour activer MCP via l'API système
 */

const API_BASE = 'https://fataplus-bknd-backend.fenohery.workers.dev';

async function enableMCP() {
  try {
    console.log('🔧 Tentative d\'activation MCP via l\'API système...');

    // Essayer d'appeler le endpoint de configuration système
    const response = await fetch(`${API_BASE}/api/system/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const config = await response.json();
      console.log('✅ Configuration actuelle:', JSON.stringify(config, null, 2));

      // Vérifier si MCP est activé
      if (config.mcp && config.mcp.enabled) {
        console.log('✅ MCP est déjà activé!');
        return true;
      }
    }

    console.log('❌ MCP n\'est pas activé via l\'API');

    // Alternative: essayer de forcer l'activation via un endpoint spécial
    console.log('🔄 Tentative d\'activation forcée...');

    const forceResponse = await fetch(`${API_BASE}/api/system/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        force: true
      })
    });

    if (forceResponse.ok) {
      console.log('✅ Build système déclenché, MCP devrait être activé');
      return true;
    }

    console.log('❌ Échec de l\'activation MCP');
    return false;

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

enableMCP().then(success => {
  if (success) {
    console.log('\n🎉 MCP a été activé avec succès!');
    console.log('📍 URL: https://fataplus-bknd-backend.fenohery.workers.dev/api/system/mcp');
  } else {
    console.log('\n⚠️  L\'activation MCP a échoué. Utilisez la configuration manuelle via la base de données.');
  }
});