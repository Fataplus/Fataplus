import type { CloudflareBkndConfig } from "bknd/adapter/cloudflare";

export default {
   d1: {
      session: true,
   },
   // Fataplus unified backend configuration
   // Multi-tenancy support for client projects
   // Enable authentication globally
   auth: true,
   // Enable MCP (Model Context Protocol)
   mcp: {
      enabled: true,
      path: "/api/system/mcp",
      logLevel: "info", // More verbose logging for debugging
   },
   // Project management collections
   collections: {
      // Client management for multi-tenancy
      clients: {
         schema: {
            id: "string",
            name: "string",
            email: "string",
            projects: "array",
            created_at: "datetime",
            updated_at: "datetime",
         },
         permissions: {
            read: ["admin", "client"],
            write: ["admin"],
         },
      },
      // Project intake and management
      projects: {
         schema: {
            id: "string",
            client_id: "string",
            title: "string",
            description: "text",
            status: "string", // pending, active, completed
            category: "string", // agri-tech, design, consulting
            requirements: "json",
            created_at: "datetime",
            updated_at: "datetime",
         },
         permissions: {
            read: ["admin", "client"],
            write: ["admin", "client"],
         },
      },
      // Agri-tech specific data
      agricultural_data: {
         schema: {
            id: "string",
            project_id: "string",
            crop_type: "string",
            farm_size: "number",
            location: "json",
            irrigation_system: "string",
            yield_data: "json",
            created_at: "datetime",
         },
         permissions: {
            read: ["admin", "client"],
            write: ["admin", "client"],
         },
      },
   },
   // Enable admin UI for visual management
   ui: {
      enabled: true,
      path: "/admin",
   },
   // CORS for frontend integration
   cors: {
      origins: ["http://localhost:3000", "https://fata.plus", "https://www.fata.plus", ],
      credentials: true,
   },
} satisfies CloudflareBkndConfig;
