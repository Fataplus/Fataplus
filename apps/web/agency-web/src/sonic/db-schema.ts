import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const contentTable = sqliteTable('content', {
  id: text('id').primaryKey(),
  collection_id: text('collection_id').notNull(),
  slug: text('slug').notNull(),
  title: text('title'),
  data: text('data', { mode: 'json' }),
  status: text('status'),
  created_at: integer('created_at'),
  updated_at: integer('updated_at'),
  created_by: text('created_by'),
  updated_by: text('updated_by')
});

export const settingsTable = sqliteTable('settings', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  key: text('key').notNull(),
  value: text('value'),
  created_at: integer('created_at'),
  updated_at: integer('updated_at'),
  created_by: text('created_by'),
  updated_by: text('updated_by')
});
