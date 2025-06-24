-- Migration: Add superadmin role to users table
-- Date: 2025-06-24
-- Description: Updates the role enum to include superadmin role

-- First, add a temporary column with the new enum
ALTER TABLE users ADD COLUMN role_new TEXT CHECK (role_new IN ('superadmin', 'admin', 'farmer', 'vendor', 'user')) DEFAULT 'user';

-- Copy existing data
UPDATE users SET role_new = role;

-- Drop the old column (SQLite doesn't support dropping columns directly in old versions)
-- We'll create a new table and migrate data

-- Create new users table with updated role enum
CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('superadmin', 'admin', 'farmer', 'vendor', 'user')) NOT NULL DEFAULT 'user',
  password_hash TEXT NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 0,
  email_verification_token TEXT,
  email_verification_expires INTEGER,
  password_reset_token TEXT,
  password_reset_expires INTEGER,
  last_login_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Copy data from old table to new table
INSERT INTO users_new 
SELECT id, email, name, role_new, password_hash, is_verified, email_verification_token, 
       email_verification_expires, password_reset_token, password_reset_expires, 
       last_login_at, created_at, updated_at 
FROM users;

-- Drop old table and rename new table
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- Clean up
DROP TABLE IF EXISTS users_temp; 