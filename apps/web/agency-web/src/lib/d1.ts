import { drizzle } from 'drizzle-orm/d1';

export function getDb(context: any) {
  // context is Astro.locals.runtime.env
  if (context?.DB) {
    return drizzle(context.DB);
  }
  // Fallback for dev mode without wrangler proxy or if binding is missing
  console.warn('D1 Database binding (DB) not found');
  return null;
}
