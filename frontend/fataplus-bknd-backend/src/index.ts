import { serve } from "bknd/adapter/cloudflare";

// Basic configuration
const config = {
  d1: {
    session: true,
  },
  auth: true,
  ui: {
    enabled: true,
    path: "/admin",
  },
  cors: {
    origins: ["http://localhost:3000", "https://fata.plus", "https://www.fata.plus", "https://fataplus.com", "https://www.fataplus.com"],
    credentials: true,
  },
};

// Create app with basic config
const app = serve(config);

// Add custom MCP endpoint
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle MCP endpoint manually
    if (url.pathname === '/api/system/mcp') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();

          // Handle MCP initialization
          if (body.method === 'initialize') {
            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id,
              result: {
                protocolVersion: "2025-06-18",
                capabilities: {
                  tools: {},
                  resources: {},
                  logging: {},
                  completions: {}
                },
                serverInfo: {
                  name: "bknd",
                  version: "0.19.0"
                }
              }
            }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              }
            });
          }

          // Handle other MCP methods
          if (body.method === 'tools/list') {
            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id: body.id,
              result: {
                tools: [
                  {
                    name: "system_info",
                    description: "Get system information",
                    inputSchema: { type: "object" }
                  },
                  {
                    name: "data_entity_read_many",
                    description: "Read multiple entities from database",
                    inputSchema: {
                      type: "object",
                      properties: {
                        entity: { type: "string" },
                        filter: { type: "object" }
                      },
                      required: ["entity"]
                    }
                  }
                ]
              }
            }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }
            });
          }

        } catch (error) {
          return new Response(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32700,
              message: "Parse error"
            }
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Handle OPTIONS for CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }

      return new Response('Method not allowed for MCP', { status: 405 });
    }

    // Handle all other requests with the main app
    return app.fetch(request, env, ctx);
  }
};
