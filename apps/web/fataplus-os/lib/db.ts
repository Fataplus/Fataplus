import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export interface Env {
    DB: D1Database;
}

// Helper to get DB instance from Cloudflare Env
export const getDb = (env: Env) => {
    return drizzle(env.DB, { schema });
};
