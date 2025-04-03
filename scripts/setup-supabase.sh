#!/bin/bash

# This script helps set up the Supabase database with migrations and seed data

# Check if the Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if the user is logged in
if ! supabase projects list &> /dev/null; then
    echo "You need to log in to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Get the project ID from config.toml
PROJECT_ID=$(grep -o 'project_id = "[^"]*"' supabase/config.toml | cut -d'"' -f2)

if [ -z "$PROJECT_ID" ]; then
    echo "Could not find project_id in supabase/config.toml"
    echo "Please make sure you have set up your Supabase project correctly"
    exit 1
fi

echo "Using Supabase project ID: $PROJECT_ID"

# Run the migrations
echo "Running migrations..."
for migration in supabase/migrations/*.sql; do
    echo "Applying migration: $migration"
    supabase db push --db-url "postgresql://postgres:postgres@localhost:54322/postgres" "$migration"
done

# Run the seed data
echo "Running seed data..."
supabase db execute --file supabase/seed.sql

echo "Supabase setup complete!"
echo "You can now update your .env.local file with your Supabase credentials:"
echo "VITE_SUPABASE_URL=https://$PROJECT_ID.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=<your-anon-key>"
