import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc } from 'drizzle-orm';
import { contentTable } from './db-schema';

// Helper to get DB instance
export const getDb = (env: any) => {
    if (!env.DB) {
        throw new Error('D1 Database binding (DB) not found in environment.');
    }
    return drizzle(env.DB);
};

// Fetch all entries for a collection
export const getCollection = async (env: any, collection: string) => {
    const db = getDb(env);
    const items = await db.select()
        .from(contentTable)
        .where(eq(contentTable.collection_id, collection))
        .orderBy(desc(contentTable.created_at));

    return items.map(item => ({
        ...item,
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
    }));
};

// Fetch a single entry by slug
export const getEntry = async (env: any, collection: string, slug: string) => {
    const db = getDb(env);
    const result = await db.select()
        .from(contentTable)
        .where(
            and(
                eq(contentTable.collection_id, collection),
                eq(contentTable.slug, slug)
            )
        )
        .limit(1);

    if (result.length === 0) return null;

    const item = result[0];
    return {
        ...item,
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
    };
};

// Alias for getEntry (used in some pages)
export const getContentBySlug = getEntry;

// Alias mostly used for settings/global data (same as getEntry for now)
export const getSetting = getEntry;

// Alias for getCollection (used in studio.astro)
export const getContentList = getCollection;
