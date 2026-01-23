import { Hono } from "hono";
import { type APIContext } from "astro";
import { createSonicJSApp } from "@sonicjs-cms/core";
import { sonicConfig } from "../../sonic/config";

// We need to initialize the app lazily because we need the env (D1 database) 
// which is passed in the request context by Astro's Cloudflare adapter

export const ALL = async (context: APIContext) => {

    const { request, locals } = context;

    // Assuming the D1 database binding is named 'DB' in wrangler.toml or Cloudflare dashboard
    // If using a different name, update it here.
    // The Cloudflare adapter puts bindings in locals.runtime.env
    const env = (locals as any).runtime?.env || {};

    // Fallback for dev if not using wrangler proxy
    // In pure 'astro dev', bindings might be mocked differently or missing.

    // We don't need to pass env to createSonicJSApp, it's bound at request time
    const app = createSonicJSApp(sonicConfig);

    return app.fetch(request, env, (locals as any).runtime?.ctx);
};
