import type { APIContext } from "astro";
import { createSonicJSApp } from "@sonicjs-cms/core";
import { sonicConfig } from "../../sonic/config";

export const ALL = async (context: APIContext) => {
    const { request, locals } = context;
    const env = (locals as any).runtime?.env;

    console.log("Auth Request:", request.url);

    const app = createSonicJSApp(sonicConfig);

    return app.fetch(request, env, (locals as any).runtime?.ctx);
};
