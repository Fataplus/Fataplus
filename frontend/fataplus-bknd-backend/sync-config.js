#!/usr/bin/env node

/**
 * Script pour synchroniser la configuration avec la base de données
 */

const API_BASE = 'https://fataplus-bknd-backend.fenohery.workers.dev';

async function syncConfig() {
  try {
    console.log('🔄 Synchronisation de la configuration...');

    // Forcer un rebuild pour synchroniser la configuration
    const buildResponse = await fetch(`${API_BASE}/api/system/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        force: true,
        sync: true
      })
    });

    if (buildResponse.ok) {
      console.log('✅ Build système déclenché');
      const result = await buildResponse.text();
      console.log('Résultat:', result);
      return true;
    } else {
      console.log('❌ Échec du build système');
      const error = await buildResponse.text();
      console.log('Erreur:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

syncConfig().then(success => {
  if (success) {
    console.log('⏱️  Attente de 15 secondes pour la propagation...');

    setTimeout(async () => {
      console.log('🧪 Test de MCP après synchronisation...');

      try {
        const mcpTest = await fetch(`${API_BASE}/api/system/mcp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
              "protocolVersion": "2024-11-05",
              "capabilities": {},
              "clientInfo": {
                "name": "sync-test",
                "version": "1.0.0"
              }
            }
          })
        });

        if (mcpTest.ok) {
          const response = await mcpTest.json();
          console.log('✅ MCP est maintenant activé!');
          console.log('📊 Réponse:', JSON.stringify(response, null, 2));
        } else {
          console.log('❌ MCP retourne toujours 404');
          console.log('Status:', mcpTest.status);
          console.log('Response:', await mcpTest.text());
        }
      } catch (testError) {
        console.error('❌ Erreur lors du test MCP:', testError.message);
      }
    }, 15000);
  } else {
    console.log('❌ Échec de la synchronisation');
  }
});