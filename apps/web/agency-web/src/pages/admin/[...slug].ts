import type { APIContext } from "astro";
import { createSonicJSApp } from "@sonicjs-cms/core";
import { sonicConfig } from "../../sonic/config";

export const ALL = async (context: APIContext) => {
    const { request, locals } = context;
    const env = (locals as any).runtime?.env;

    console.log("Admin Request:", request.url);

    // We initialize the app. 
    // Note: SonicJS might expect to handle routes starting from root or /admin.
    // If mounted here, Astro strips nothing. 
    // We pass the request as-is.
    console.log("Admin Request:", request.url);
    if (sonicConfig.collections) {
        console.log("SonicJS Config Collections:", sonicConfig.collections.map((c: any) => c.name));
    } else {
        console.log("SonicJS Config Collections: NONE");
    }

    // We initialize the app.
    const app = createSonicJSApp(sonicConfig);

    return app.fetch(request, env, (locals as any).runtime?.ctx);
};
